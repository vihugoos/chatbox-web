import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/api';

type User = {
    id: string,
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string
    }
}

export const AuthContext = createContext({} as AuthContextData) 

export function AuthProvider(props: AuthProvider) {
    const [ user, setUser ] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${import.meta.env.VITE_OAUTH_APP_CLIENT_ID}`

    // Capture the code in the url and then hide it from the user 
    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)
        }
    }, [])

    // Generate token for user, store in localStorage and update state variable 'user' 
    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })

        const { token, user } = response.data

        localStorage.setItem('@chatbox:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    // Capture the token from localStorage and make a request to capture info of profile 
    useEffect(() => {
        const token = localStorage.getItem('@chatbox:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    // Log out the github account 
    function signOut() {
        setUser(null)
        localStorage.removeItem('@chatbox:token')
    }

    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}

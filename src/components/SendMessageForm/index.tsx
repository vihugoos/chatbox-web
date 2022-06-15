import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../context/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast,  } from 'react-toastify'

export function SendMessageForm() {

    const { user, signOut } = useContext(AuthContext) 
    const [message, setMessage] = useState('')

    // Send message to the database 
    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()

        if (!message.trim()) {
            return 
        }

        await api.post('messages', { message })

        toast.success('Message sent successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });

        setMessage('')
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32"/>
            </button>

            <header className={styles.userInformation}>
                
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>

                <strong className={styles.userName}>
                    {user?.name}
                </strong>

                <span className={styles.userGithub}> 
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>

                <form className={styles.sendMessageForm} onSubmit={handleSendMessage}>
                    <label htmlFor="message"> Message </label>

                    <textarea
                        name="message"
                        id="message"
                        placeholder="Write your message here..."
                        maxLength={130}
                        onChange={event => setMessage(event.target.value)}
                        value={message}
                    />

                    <button type="submit"> Send message </button>
                </form>
                
            </header>

            <ToastContainer />
        </div>
    )
}

import React from 'react';
import { logoutUser } from '../serverCommunication'
import { useHistory } from 'react-router-dom'

export default function Logout(props) {
    const history = useHistory();

    logoutUser()
        .then(() => {
            props.handleLoginState(false)
            history.push('/login')
        })
    return <div>
    </div>
}

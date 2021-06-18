import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const SignIn = ({ onSignin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const signIn = async () => {
        try {
            const user = await Auth.signIn(username, password);
            history.push('/');
            console.log(user);
            onSignin();
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <div className="login">
            <TextField
                id="username"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button id="signinButton" color="primary" onClick={signIn}>
                Sign In
            </Button>
        </div>
    );
};

export default SignIn;
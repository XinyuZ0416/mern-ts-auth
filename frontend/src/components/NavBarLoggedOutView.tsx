import React from 'react'
import { User } from '../models/user'
import * as NotesApi from "../network/notes_api";
import { Button, Navbar } from 'react-bootstrap';

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void,
  onLoginClicked: () => void,
}

export const NavBarLoggedOutView = ({onSignUpClicked, onLoginClicked}: NavBarLoggedOutViewProps) => {
  
  return (
    <>
    <Button onClick={onSignUpClicked}>Sign Up</Button>
    <Button onClick={onLoginClicked}>Log In</Button>
    </>
  )
}

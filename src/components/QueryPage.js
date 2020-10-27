import React, { useContext, useState, useEffect } from 'react'
import { Heading, Box, DialogContent, DividerVertical, Flex } from '@looker/components'
import styled from 'styled-components'
import {ExtensionContext} from '@looker/extension-sdk-react'
import { ExtensionButton } from './ExtensionButton'
import { LookerExtensionSDK } from '@looker/extension-sdk'
import Loader from 'react-loader-spinner'


export const QueryPage = (props) => {
    const context = useContext(ExtensionContext)
    const { extensionSDK } = context
    const [messages, setMessages] = useState('')
    const [funFact, setFunFact] = useState('')
    const [usersState, setUsersState] = useState(props)
    const [attribute, setAttribute] = useState([])
    const sdk = context.core40SDK
    
    

    useEffect(() => {
       setUsersState(props);
    },[props])

    //// Used to update/clear the box component with results of query ////

    const updateMessages = (message, error) => {
        setMessages((prevMessages) => {
          const maybeLineBreak = prevMessages.length === 0 ? '' : '\n'
          const fullMessage = error ? `${message}\n${error}` : message
          return `${prevMessages}${maybeLineBreak}${fullMessage}`
        })
    }
    
    const clearMessagesClick = () => {
        setMessages('')
    }

    /////////////////////

    
    //// SDK Methods ////

    const getUser = async () => {
        try {
          const userDetails = await sdk.ok(
            sdk.me()
          )
            updateMessages(JSON.stringify(userDetails, null, 2))
        } catch (error) {
            updateMessages('Error invoking me endpoint', error)
        }
    }


    // const getUserAttributes = async () => {
    //   try {
    //     const attributes = usersState.data.id
    //     const allAttributes = await sdk.ok(
    //       sdk.some_api_endpoint()
    //     )
    //       updateMessages(JSON.stringify(placeholder, null, 2))
    //       setAttribute(allAttributes)
    //   } catch (error) {
    //     console.log('failed to get user attributes', error)
    //   }
    // }

    /////////////////////


    return (
        <>
          <Heading mt="xlarge">Query Playground</Heading>
          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" width="50%" maxWidth="40vw">
              <ExtensionButton
                mt="small"
                variant="outline"
                onClick={getUser}
              >
                Get User (me())
              </ExtensionButton>
              {/* <ExtensionButton
                mt="small"
                variant="outline"
                onClick={getUserAttributes}
              >
                Get User Attributes
              </ExtensionButton> */}
              <ExtensionButton
                mt="small"
                variant="outline"
                onClick={clearMessagesClick}
                >
                Clear messages
            </ExtensionButton>
            </Box>
            <Box>
              <DividerVertical stretch/>
            </Box>
            <Box height="30rem" pr="large" width="100%">
                <DialogContent>
                  <StyledPre>{messages}</StyledPre>
                </DialogContent>
            </Box>
        </Box>
        <Box>
          {JSON.stringify()}
        </Box>
        </>
    )

}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  height: 100%;
  padding: 20px;
`
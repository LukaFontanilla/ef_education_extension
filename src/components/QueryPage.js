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

    const name_of_function = async () => {
      try {
        const some_variable = await sdk.ok(
          sdk.some_api_method()
        )
          /// do something here
      } catch (error) {
          /// do something here
      }
  }

    const getUserAttributes = async () => {
      try {
        const attributes = usersState.data.id
        const allAttributes = await sdk.ok(
          sdk.user_attribute_user_values({user_id: attributes, fields: 'label, value, user_can_edit'})
          // sdk.user_attribute_user_values({user_id: attributes})
        )
        // const cleaned = allAttributes.filter(attribute => attribute.value != "")
        // console.log(cleaned)
          updateMessages(JSON.stringify(allAttributes, null, 2))
      } catch (error) {
        console.log('failed to get user attributes', error)
      }
    }

    /////////////////////


    ////// External API Method ////////
    const runRapid = async () => { 
      let rapidApi = `https://rapidapi.p.rapidapi.com/333/math?fragment=true&json=true`
      let response = await extensionSDK.fetchProxy(
      `${rapidApi}`,
      {
        method: 'GET',
        headers: {
          "x-rapidapi-host": "numbersapi.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPID_API_KEY
        }
        ,
        body: JSON.stringify(response)
      }
      ).then(response => {
          // console.log(response)
          setFunFact(response.body.text)
        })
    }

    /////////////////////

    return (
        <>
          <Heading mt="xlarge">Query Playground</Heading>
          {/* {!funFact ? 
          <Loader 
          type="Puff"       
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000}/> :
          <Heading mt="medium">{funFact}</Heading>} */}
          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" width="50%" maxWidth="40vw">
              <ExtensionButton
                mt="small"
                variant="outline"
                onClick={getUser}
              >
                Get User (me())
              </ExtensionButton>
              <ExtensionButton
                mt="small"
                variant="outline"
                onClick={getUserAttributes}
              >
                Get User Attributes
              </ExtensionButton>
              {/* <ExtensionButton
                mt="small"
                variant="outline"
                onClick={runRapid}
              >
                Add New SDK Method Here
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
        </>
    )

}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  height: 100%;
  padding: 20px;
`
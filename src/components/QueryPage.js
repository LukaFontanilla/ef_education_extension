import React, { useContext, useState, useEffect } from 'react'
import { Heading, Box, Card, CardMedia, CardContent, Text, SpaceVertical } from '@looker/components'
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
    const [data, setData] = useState([])
    const sdk = context.core40SDK
    
    

    useEffect(() => {
       setUsersState(props);
    },[props])

    useEffect(() => {
      if(usersState.data.id) {
        getUserAttributes();
      }
    },[usersState.data.id])

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

    const getUserAttributes = async () => {
      try {
        const attributes = usersState.data.id
        const allAttributes = await sdk.ok(
          sdk.user_attribute_user_values({user_id: attributes, fields: `label, value, user_can_edit`})
        )
        const cleaned = allAttributes.filter(attribute => attribute.value != "")
        // console.log(cleaned)
          setData(cleaned)
          // updateMessages(JSON.stringify(cleaned, null, 2))
      } catch (error) {
        console.log('failed to get user attributes', error)
      }
    }

    const dataClean = Object.assign(data[0] ?? {})

    /////////////////////


    ////// External API Method ////////
    // const runRapid = async () => { 
    //   let rapidApi = `https://rapidapi.p.rapidapi.com/333/math?fragment=true&json=true`
    //   let response = await extensionSDK.fetchProxy(
    //   `${rapidApi}`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       "x-rapidapi-host": "numbersapi.p.rapidapi.com",
    //       "x-rapidapi-key": process.env.RAPID_API_KEY
    //     }
    //     ,
    //     body: JSON.stringify(response)
    //   }
    //   ).then(response => {
    //       // console.log(response)
    //       setFunFact(response.body.text)
    //     })
    // }

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
          <SpaceVertical gap="xxxlarge">
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
            <Box pr="large" width="100%">
                <StyledPre>{messages}</StyledPre>
            </Box>
        </Box>
        <Box width="50%">
          {!dataClean.value ? <Loader />:
            <Card raised>
              <CardMedia image="https://picsum.photos/200/300?random=1" title="random_pic" />
              <CardContent>
              <Text
                  fontSize="xsmall"
                  textTransform="uppercase"
                  fontWeight="semiBold"
                  variant="subdued"
              >
                First Name
              </Text>
                <Heading as="h4" fontSize="medium" fontWeight="semiBold" >{dataClean.value}</Heading>
              </CardContent>  
            </Card>}
        </Box>
        </SpaceVertical>
        </>
    )

}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  border: 1px solid #c1c6cc;
  height: 100%;
  padding: 20px;
`
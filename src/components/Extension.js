/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useContext, useState, useEffect } from 'react'
import { Switch, Route, Link, useHistory, useLocation } from 'react-router-dom'
import styled from "styled-components";
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedLook } from './EmbedLook'
import { EmbedDashboard } from './EmbedDashboard'

import { 
  Heading,
  Button, 
  Flex, 
  FlexItem,
  MenuList,
  MenuItem,
  Icon,
  Card,
  CardContent,
  CardMedia,
  Text,
  SpaceVertical,
  Box,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableRow,
  TableHeaderCell,
  Accordion,
  AccordionContent,
  AccordionDisclosure,
  ButtonItem,
  ButtonToggle
} from '@looker/components'
import  Loader  from "react-loader-spinner"
import CountUp from 'react-countup'
import Spectrum from "react-spectrum"
import { QueryPage } from './QueryPage'
import { AttributeTable } from './AttributeTable'



const Extension = ( { route, routeState } ) => {
  const context = useContext(ExtensionContext)
  const sdk = context.core40SDK
  let history = useHistory();

  const [user, setUser] = useState({})
  const [userRole, setRole] = useState({})
  const [groups, setGroup] = useState([])
  const [query, setQuery] = useState({})
  const [value, setValue] = useState('User Home')

  const menuGroups = [];

  //////// Lifecycle Methods //////////

  useEffect(()=>{
    getUser();
    getGroups();
  }, [])

  useEffect(() => {
    if(user){ 
      getRoles();
      // runQuery();
    }
  }, [user])

  useEffect(() => {
    if(user.display_name) {
      runQuery();
    }
  }, [user.display_name])

  /////////////////////////////////////



  ///////// SDK METHODS //////////// 

  const getUser = async () => {
    try {
      const userDetails = await sdk.ok(
        sdk.me()
      )
      setUser(userDetails)
    } catch (error) {
       console.log('failed to get user', error)
    }
  }

  const getRoles = async () => {
    try {
      // await user.role_ids.forEach((role) => {
          const userRoles = await sdk.ok(
          sdk.role(user.role_ids[0])
        )
          setRole(userRoles)
        // console.log(userRoles)
      // })
    } catch (error) {
      console.log('failed to get roles', error)
    }
  }

  const getGroups = async () => {
    try {
      const userGroupDetails = await sdk.ok(
        sdk.all_groups({fields:`name, user_count, contains_current_user, id`})
      )
      const cleaned = userGroupDetails.filter(detail => detail.contains_current_user == true)
      setGroup(cleaned)
    } catch (error) {
       console.log('failed to get groups', error)
    }
  }


  const runQuery = async () => {
    try {
      const queryDetails = await sdk.ok(
        sdk.run_inline_query({
          result_format: 'json_detail',
          body: {
            model: 'system__activity', 
            view:'history', 
            fields: ['history.query_run_count', 'history.approximate_usage_in_minutes'],
            filters : {'user.name':user.display_name} 
          },
        })
      )
      console.log(queryDetails)

      /////// queryDetails.data contains object literals that have the data needed
      /////// the below is used for transformation to access those name objects

      const userQuery = queryDetails.data ?? []
      const cleanedQuery = Object.assign(userQuery[0] ?? {})
      const queries = []
      const test = Object.keys(cleanedQuery).forEach((key) => queries.push(cleanedQuery[key] ?? {}))
      
      ///////

      setQuery(queries)
    } catch (error) {
      console.log('failed to get query', error)
    }
  }

  ///////////////////////////////////


  //// Clean Up Methods /////////

  const userPermissions = Object.assign(userRole.permission_set ?? {})
  const userModels = Object.assign(userRole.model_set ?? {})
  const queriesOne = Object.assign(query[0] ?? {})
  const queriesTwo = Object.assign(query[1] ?? {})

  ///////////////////////////////////////////////

  return(
    <>
      <Card raised height="auto">
      <CardContent>
        <Heading fontSize="xlarge">DCL: Extension Framework Sandbox</Heading>
        <Heading as="h4" fontSize="xsmall">
          Explore JS API - Embed SDK - Components
        </Heading>
        <Text fontSize="xsmall" variant="subdued">
          Savvvvvyy
        </Text>
      </CardContent>
      </Card>
      <Flex height="auto">
        <Box
          width="auto"
          height="auto"
          bg=""
          p="small"
          border="10px black"
          borderRight="solid 1px"
          borderColor="palette.charcoal200"
        >
            <MenuList>
            <MenuItem icon="Home">Home</MenuItem>
            <MenuItem icon="Table"><a href="https://docs.looker.com/data-modeling/extension-framework/extension-framework-intro" target="_blank">Playbook Home</a></MenuItem>
            <MenuItem icon="Image"><a href="https://www.istockphoto.com/jp/%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88/%E3%81%9F%E3%81%93%E7%84%BC%E3%81%8D?mediatype=illustration&phrase=%E3%81%9F%E3%81%93%E7%84%BC%E3%81%8D&sort=mostpopular" target="_blank">たこ焼き</a></MenuItem>
            </MenuList>
        </Box>
        <Box flexGrow={1}> 

      {!user.display_name ?
      <Spectrum
      width={500}
      colors={["#e8ccfc","#b26efc","#4843fc","#edfe9a","#c5fd98","#7dfc91","#fee1b5"]}
      wordWidths={[20,30,40,50,60]}
      wordDistances={[4,4,6]}
      lineDistance={6}
      paragraphDistance={20}
      paragraphs={1}
      linesPerParagraph={6}
      wordHeight={11}
      wordRadius={10}
      truncateLastLine={false} />
      
      :
      <>
      <Box padding="20px 50px 50px 50px" bg="white">
      <Flex
        px="large"
        py="small"
      >
        <ButtonToggle value={value} onChange={setValue}>
          <ButtonItem>User Home</ButtonItem>
          <ButtonItem>Query Page</ButtonItem>
        </ButtonToggle>
      </Flex>
      {value === "User Home" ?
      <SpaceVertical gap="xxxlarge"> 
      <Card raised height="auto" bg="#ea7dc">
      <Flex
        px="large"
        mb="small"
        mt="small"
        height="auto"
        width="auto"
        alignItems="center"
        justifyContent="space-between"
      >
      <FlexItem >
            <Box>
            <Card raised>
              <CardMedia image="https://picsum.photos/200/300?random=1" title="random_pic" />
              <CardContent>
              <Text
                  fontSize="xsmall"
                  textTransform="uppercase"
                  fontWeight="semiBold"
                  variant="subdued"
              >
                User
              </Text>
                <Heading as="h4" fontSize="medium" fontWeight="semiBold" >{user.display_name}</Heading>
              </CardContent>
            </Card>
            </Box>
        </FlexItem>
      <FlexItem flex="2" padding="50px">
            <Box>
            <Heading fontSize="xxxxlarge" textAlign="left">
              <Icon name="ExploreOutline" color="inform" size="large"/>  Query Run Count:  <CountUp end={queriesOne.value ?? 0} duration={4} /> <br/> <Icon name="Lqa" color="inform" size="large"/>  Approx. Web Usage in Minutes: <CountUp end={queriesTwo.value ?? 0} duration={4} />
            </Heading>
            </Box>
      </FlexItem>
      </Flex>
      </Card>
      <Box
      padding="20px 20px 20px 20px"
      width="100%"
      height="50%"
      bg="keyAccent"
      border="1px solid black"
      borderRadius="4px"
      >
      <Table px="30px" py="30px">
      <TableHead>
        <TableRow>
          <TableHeaderCell p="small">ID</TableHeaderCell>
          <TableHeaderCell p="small">Display Name</TableHeaderCell>
          <TableHeaderCell p="small">Email</TableHeaderCell>
          <TableHeaderCell p="small">Locale</TableHeaderCell>
          <TableHeaderCell p="small">Personal Folder ID</TableHeaderCell>
          <TableHeaderCell p="small">Roles</TableHeaderCell>
          <TableHeaderCell p="small">Groups</TableHeaderCell>
          <TableHeaderCell p="small">Permissions</TableHeaderCell>
          <TableHeaderCell p="small">Models</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableDataCell p="small">{user.id}</TableDataCell>
          <TableDataCell p="small">{user.display_name}</TableDataCell>
          <TableDataCell p="small">{user.email}</TableDataCell>
          <TableDataCell p="small">{user.locale}</TableDataCell>
          <TableDataCell p="small"><a href={"https://dcl.dev.looker.com/folders/" + user.personal_folder_id} target="_blank">{user.personal_folder_id}</a></TableDataCell>
          <TableDataCell p="small"><strong>ID: </strong>  {userRole.id}  <b>Role: </b> {userRole.name}</TableDataCell>
          <TableDataCell>
          <Accordion>
            <AccordionDisclosure>Group Information</AccordionDisclosure>
            <AccordionContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Total_Users</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map(group => 
                <TableRow key={group.id}>
                  <TableDataCell p="small">{group.id}</TableDataCell>
                  <TableDataCell>{group.name}</TableDataCell>
                  <TableDataCell>{group.user_count}</TableDataCell>
                </TableRow>
                )}
              </TableBody>
            </Table>
            </AccordionContent>
          </Accordion>
          </TableDataCell>
          <TableDataCell p="small">
            <Accordion>
                <AccordionDisclosure>Show me the models!</AccordionDisclosure>
                <AccordionContent>{userPermissions.permissions && userPermissions.permissions.map(p => p + '\n')}</AccordionContent>
            </Accordion>  
          </TableDataCell>
          <TableDataCell p="small">
            <Accordion>
              <AccordionDisclosure>Show me the models!</AccordionDisclosure>
              <AccordionContent>{userModels.models && userModels.models.map(m => m + '\n')}</AccordionContent>
            </Accordion>
          </TableDataCell>
        </TableRow>
      </TableBody> 
      </Table>
      
    </Box>
      <Card raised height="auto" bg="#ea7dc">
      <EmbedDashboard id={962} type="next" value={user.display_name}/>
      </Card>
    </SpaceVertical>
    : 
      <QueryPage data={user}/>
    }
    </Box>
    </>
    }
    </Box>
    </Flex>
    
    </>
  )
}

export default Extension

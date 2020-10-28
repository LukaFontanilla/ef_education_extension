import React, { useContext, useState, useEffect } from 'react'
import styled from "styled-components";
import { ExtensionContext } from '@looker/extension-sdk-react'
import {
    Table,
    TableBody,
    TableDataCell,
    TableHead,
    TableRow,
    TableHeaderCell,
    Heading, 
    Box,
    Spinner,
    Pagination
} from '@looker/components'

export const AttributeTable = (props) => {
    const [usersState, setUsersState] = useState(props)
    const [currentPage, setCurrentPage] = useState(1)
    const attributePerPage = 1

    useEffect(() => {
        setUsersState(props)
    }, [props])

    const userAttributes = usersState.data ?? []
    const totalPages = userAttributes.length / attributePerPage

    const attributes = userAttributes.map(({ name, value}, index) => {
        return (
            // index + 1 === currentPage && (
                <TableRow key={name}>
                    <TableDataCell>{name}</TableDataCell>
                    <TableDataCell>{value}</TableDataCell>
                </TableRow>
            // )
        )
    })

    return (
        <>
                <>
                <Box>
                    <Heading>User Attributes</Heading>
                    <Table px="30px" py="30px">
                    <TableHead>
                        <TableRow>
                        <TableHeaderCell p="small">Name</TableHeaderCell>
                        <TableHeaderCell p="small">Value</TableHeaderCell>
                        {/* <TableHeaderCell p="small">Can Edit?</TableHeaderCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attributes}                
                     </TableBody>
                    </Table>
                </Box>
                {/* <Pagination
                    current={currentPage}
                    pages={totalPages}
                    onChange={setCurrentPage}
                /> */}
                </>
           
            {/* <Box>{JSON.stringify(attributes[0])}</Box> */}
        </>
    )

}
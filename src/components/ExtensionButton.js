import * as React from "react"
import { ButtonOutline } from "@looker/components"
import styled from "styled-components"

export const ExtensionButton = ({
  children,
  onClick,
  ...rest
}) => {
  return (
    <StyledButton onClick={onClick} mb="small" {...rest}>
      <StyledLabel>{children}</StyledLabel>
    </StyledButton>
  )
}

const StyledButton = styled(ButtonOutline)`
  text-align: center;
`

const StyledLabel = styled.div`
  display: inline-block;
  width: 100%;
`
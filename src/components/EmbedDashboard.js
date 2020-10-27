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

import React, { useCallback, useContext, useState } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'


export const EmbedDashboard = ({id, value}) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)


  //// event listener functions ////

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const resizeContent = (height) => {
    var elem = document.getElementById('looker-embed').firstChild
    elem.setAttribute('height', height)
  }


  //////////////////////////////////

  //// embed dashboard with sdk ////


  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = context?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id)
        
        db.appendTo(el)
          .withClassName('looker-dashboard')
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    },
    [id, value]
  )

  ////////////////////////////////////

  return (
    <> 
      <EmbedContainer id='looker-embed' ref={embedCtrRef} />
    </>
  )
}
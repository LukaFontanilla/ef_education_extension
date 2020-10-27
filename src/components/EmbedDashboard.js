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
import { Heading, MessageBar, Paragraph } from '@looker/components'


export const EmbedDashboard = ({id, value}) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)
  const [show, setShow] = useState(false)


  //// event listener functions ////

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const resizeContent = (height) => {
    var elem = document.getElementById('looker-embed').firstChild
    elem.setAttribute('height', height)
  }

  const updateUI = (show, callback) => {
    setShow(show);
    callback();
  }

  const revertUI = () => {
      setTimeout(() => setShow(false), 5000)
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
          .withFilters({'user.name': value})
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', updateUI.bind(null, true, revertUI))
          .on('dashboard:tile:view', canceller)
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
    {show ? <MessageBar intent="warn">
              <Paragraph>
                <strong>FYI</strong> currently exploring dashboard tiles is not allowed. Please contact the lookerdev@yourstruly.com for further inquires.
              </Paragraph>
            </MessageBar> :
    <EmbedContainer id='looker-embed' ref={embedCtrRef} />
    }
    </>
  )
}
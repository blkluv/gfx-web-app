/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Tabs } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { OrderBook } from './OrderBook'
import { useCrypto, usePriceFeed } from '../../context'
import { Loader } from '../../components'

const TAB_NAMES = [
  { display: 'Orderbook', key: 'orderbook' },
  { display: 'Recent Trades', key: 'trades' },
  { display: '', key: 'price' }
]

const WRAPPER = styled.div`
  ${tw`w-full flex flex-col h-full`}
`

const HEADER_WRAPPER = styled.div`
  ${tw`w-full flex flex-row`}
  .tabGroup {
    ${tw`w-full flex`}
    .individualTabs {
      ${tw`w-5/12 text-center h-7 flex justify-center items-center`}
    }
    .priceTab {
      ${tw`h-7 w-2/12 flex justify-center items-center text-xs`}
    }
  }
`
const BODY_WRAPPER = styled.div`
  ${tw`w-full flex flex-row h-full`}
`

export const OrderbookTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'orderbook' | 'trades' | 'price'>('orderbook')
  const { prices, tokenInfo, refreshTokenData } = usePriceFeed()
  const { selectedCrypto } = useCrypto()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const onChange = (e) => {
    setSelectedTab(e.target.value)
  }
  return (
    <WRAPPER>
      <HEADER_WRAPPER>
        <Radio.Group value={selectedTab} onChange={onChange} className="tabGroup">
          {TAB_NAMES.map((item) => (
            <Radio.Button
              key={item.key}
              value={item.key}
              className={item.key !== 'price' ? 'individualTabs' : 'priceTab'}
            >
              {item.key !== 'price' ? (
                item.display
              ) : !marketData || !marketData.current ? (
                <Loader />
              ) : (
                <div>${marketData.current}</div>
              )}
            </Radio.Button>
          ))}
        </Radio.Group>
      </HEADER_WRAPPER>
      <BODY_WRAPPER>{selectedTab === 'orderbook' ? <OrderBook /> : null}</BODY_WRAPPER>
    </WRAPPER>
  )
}
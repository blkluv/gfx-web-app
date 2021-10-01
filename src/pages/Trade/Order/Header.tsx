import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { OrderSide, useMarket, useOrder } from '../../../context'
import { CenteredImg, MainText, SVGToWhite } from '../../../styles'

const ARROW = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
  margin-left: ${({ theme }) => theme.margins['2x']};
  opacity: 0;
`

const CHANGE = styled(CenteredImg)`
  display: flex;

  > div {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  span {
    font-size: 10px;
    font-weight: bold;
  }
`

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])}
`

const INFO = styled.div`
  width: 100%;
  margin: 0 ${({ theme }) => theme.margins['1.5x']};

  > div {
    display: flex;
    align-items: center;
  }
`

const PRICE = MainText(styled.span`
  display: block;
  margin: ${({ theme }) => theme.margins['0.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
  font-size: 10px;
  font-weight: bold;
  text-align: left;
`)

const SIDE = styled.div<{ $display: boolean; $side: OrderSide }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -14.5px;
    left: ${({ $side }) => ($side === 'buy' ? '-20px' : '104px')};
    width: 43%;
    height: 2.5px;
    background-color: ${({ theme, $display, $side }) =>
      $display ? theme[$side === 'buy' ? 'bids' : 'asks'] : '#9f9f9f'};
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  span {
    cursor: pointer;
    color: ${({ theme }) => theme.grey4};
    font-size: 12px;
    font-weight: bold;
    transition: color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

    &:hover,
    &:${({ $side }) => ($side === 'buy' ? 'first' : 'last')}-child {
      color: white;
    }
  }
`

const TICKER = MainText(styled.span`
  margin-right: ${({ theme }) => theme.margins['1.5x']};
  font-size: 12px;
  font-weight: bold;
`)

const WRAPPER = styled.div`
  position: relative;
  display: flex;
  margin: -${({ theme }) => theme.margins['2x']};
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']}
    ${({ theme }) => theme.margins['1.5x']};
  border: solid 2.5px #9f9f9f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.bg4};
  ${({ theme }) => theme.largeShadow}
`

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const Header: FC = () => {
  const { formatSymbol, getAskFromSymbol, marketsData, selectedMarket } = useMarket()
  const { order, setOrder } = useOrder()

  const asset = useMemo(() => getAskFromSymbol(selectedMarket.symbol), [getAskFromSymbol, selectedMarket])
  const marketData = useMemo(() => marketsData[selectedMarket.symbol], [marketsData, selectedMarket.symbol])
  const change24HIcon = useMemo(() => `price_${marketData.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])
  const formattedSymbol = useMemo(() => formatSymbol(selectedMarket.symbol), [formatSymbol, selectedMarket])

  const handleClick = (side: OrderSide) => {
    if (side === order.side) {
      setOrder((prevState) => ({ ...prevState, isHidden: !prevState.isHidden }))
    } else {
      setOrder((prevState) => ({ ...prevState, isHidden: false, side }))
    }
  }

  return (
    <WRAPPER>
      <ICON>
        <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
      </ICON>
      <INFO>
        <div>
          <TICKER>{formattedSymbol}</TICKER>
          {!marketData.change24H ? (
            <Loader />
          ) : (
            <CHANGE>
              <CenteredImg>
                <img src={`${process.env.PUBLIC_URL}/img/assets/${change24HIcon}`} alt="" />
              </CenteredImg>
              <span>{marketData.change24H}</span>
            </CHANGE>
          )}
        </div>
        <PRICE>{!marketData.current ? <Loader /> : <>Price: $ {marketData.current}</>}</PRICE>
        <SIDE $display={!order.isHidden} $side={order.side}>
          <span onClick={() => handleClick('buy')}>Buy</span>
          <span onClick={() => handleClick('sell')}>Sell</span>
        </SIDE>
      </INFO>
      <ARROW>
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="" />
      </ARROW>
    </WRAPPER>
  )
}
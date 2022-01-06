/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../ui-kit/colors"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { CryptoAnimation } from "../../../ui-kit/components/CryptoAnimation/CryptoAnimation"
import { PaymentMethod } from "../../../payment/methods"

const SideTop = styled.div`
    box-sizing: border-box;
    height: 136px;
    padding: 20px 15px;
    overflow: hidden;
    text-align: center;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
`

const Title = styled(Heading2)`
    margin: 15px 0;
`

const TitleDescription = styled(Small)``

const MethodToggle = styled(Toggle).attrs({
    height: "63px",
})`
    height: 63px;
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 21px;
    font-weight: bold;
`

export const TopupChooseMethod: React.FC = observer(() => {
    const { payment, router } = useStores()

    const isOptionActive = (pm: PaymentMethod): boolean => {
        return payment.paymentMethod?.name === pm.name
    }
    const selectOption = (pm: PaymentMethod) => () => {
        payment.setPaymentMethod(pm)
    }
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => router.history?.goBack()}>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={0} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Title>Top up your account</Title>
                        <TitleDescription>Select payment method</TitleDescription>
                    </SideTop>
                    <SideBot>
                        {payment.paymentMethods.map((pm) => {
                            return (
                                <MethodToggle
                                    key={pm.name}
                                    inactiveColor={lightBlue}
                                    height="63px"
                                    justify="center"
                                    active={isOptionActive(pm)}
                                    onClick={selectOption(pm)}
                                >
                                    <FontAwesomeIcon icon={pm.icon ?? "question"} fixedWidth size="sm" pull="left" />
                                    {pm.displayText}
                                </MethodToggle>
                            )
                        })}
                        <BrandButton
                            style={{ marginTop: "auto" }}
                            onClick={() => payment.onPaymentMethodChosen()}
                            disabled={!payment.paymentMethod}
                        >
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent>
                    <div style={{ paddingTop: 100 }}>
                        <CryptoAnimation currency={payment.paymentCurrency} />
                    </div>
                </ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})

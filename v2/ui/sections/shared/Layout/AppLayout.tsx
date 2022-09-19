import { FC, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { DESKTOP_SIDE_NAV_WIDTH, DESKTOP_BODY_PADDING } from '@snx-v1/constantsUi';
import ROUTES from 'constants/routes';
import NotificationContainer from 'constants/NotificationContainer';

import media from '@snx-v1/media';
import { delegateWalletState } from 'store/wallet';
import Header from './Header';
import SideNav from './SideNav';
import { Header as V2Header } from '../../../v2-components/Header';
import useSynthetixQueries from '@synthetixio/queries';
import Connector from 'containers/Connector';
import useLocalStorage from 'hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isL2 } = Connector.useContainer();

  const { useIsBridgeActiveQuery } = useSynthetixQueries();

  const depositsInactive = !(useIsBridgeActiveQuery().data ?? true); // Deposits are active by default to prevent redirects when status unknown
  const delegateWallet = useRecoilValue(delegateWalletState);

  useEffect(() => {
    if (delegateWallet && location.pathname !== ROUTES.Home) {
      navigate(ROUTES.Home);
    }
  }, [isL2, depositsInactive, delegateWallet, location.pathname, navigate]);

  const [STAKING_V2_ENABLED] = useLocalStorage(LOCAL_STORAGE_KEYS.STAKING_V2_ENABLED, false);

  return (
    <>
      {STAKING_V2_ENABLED ? (
        <V2Header />
      ) : (
        <>
          <SideNav />
          <Header />
        </>
      )}
      <Content STAKING_V2_ENABLED={STAKING_V2_ENABLED}>{children}</Content>
      <NotificationContainer />
    </>
  );
};

interface ContentProps {
  readonly STAKING_V2_ENABLED: boolean;
}

const Content = styled.div<ContentProps>`
  margin: 0 auto;
  ${({ STAKING_V2_ENABLED }) => `
    max-width: ${STAKING_V2_ENABLED ? 'unset' : '1200px'};
  `};

  ${({ STAKING_V2_ENABLED }) => media.greaterThan('mdUp')`
    padding-left: ${
      STAKING_V2_ENABLED ? '0px' : `calc(${DESKTOP_SIDE_NAV_WIDTH + DESKTOP_BODY_PADDING}px)`
    };
 `};
`;

export default AppLayout;
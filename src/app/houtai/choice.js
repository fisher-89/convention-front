import React, { PureComponent } from 'react';
import { Tabs, Layout } from 'antd';
import SweepStakess from './sweepstakess';
import Custom from './custom';
import Award from './award';
import './tabpane.less';


const TabPane = Tabs.TabPane;
const {
  Header, Footer, Content,
} = Layout;
export default class extends PureComponent {
  render() {
    const aa = window.location.origin;
    const link = aa+'/luckdraw';
    return (
      <div>
        <Layout>
          <Header className='up'>✺喜歌实业年会抽奖后台✺</Header>
          <Content >
          <div className='openurl'><a  className='aaa' href={link} target= '_blank'>✺㊖Φ打开抽奖大屏Φ㊖✺</a></div>
            <div className='all'>
              <Tabs>
                <TabPane
                  tab="抽奖"
                  key="1"
                >
                  <SweepStakess />
                </TabPane>
                <TabPane
                  tab="签到名单"
                  key="2"
                >
                  <Custom />
                </TabPane>
                <TabPane
                  tab="奖项配置"
                  key="3"
                >
                  <Award />
                </TabPane>
              </Tabs>
            </div>
          </Content>
          <Footer className='down'>喜歌实业</Footer>
        </Layout>
      </div>

    )
  }
}
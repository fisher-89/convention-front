import React, { PureComponent } from 'react';
import { Tabs, Layout } from 'antd';
import SweepStakess from './sweepstakess';
import './tabpane.less';


const TabPane = Tabs.TabPane;
const {
  Header, Footer, Content,
} = Layout;
export default class extends PureComponent {
  render () {
    return (
      <div>
      <Layout>
        <Header className='up'>喜歌实业年会抽奖后台</Header>
        <Content >
        <div className='all'>
         <Tabs>
            <TabPane 
               tab="抽奖"
               key="1"
             >
             <SweepStakess />
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
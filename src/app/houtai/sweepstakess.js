import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, InputNumber, Button, Tag, List, Card, Avatar, Tooltip } from 'antd';
import request from '../../request';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

class XX extends PureComponent {
  state = {
    alldata: [],
    award: [],
    inround: 1,
    makesure: false,
    nextround: true,
    pushable: false,
    rechoice: false,
    round: null,
    selected: [],
    start: true,
    stop: true,
    tapable: false,
  }

  componentDidMount() {
    const _this = this;
    const { setFieldsValue } = this.props.form;
    const options = {
      type: 'get',
      params: {},
    }
    request('/api/award', options, (response) => _this.setState({ award: response.data }), (error) => this.errors(error));
    function asd(response) {
      if (response.data.length > 0) {
        const last = (response.data)[response.data.length - 1];
        let winner = [];
        if (last) {
          _this.setState({ inround: last.round });
          if (last.winners.length) {
            winner = last.winners.map(item => item.sign);
          }
        }

        if (last.winners.length < last.persions) {
          if (last.is_progress) {
            if (last.winners.length) {
              setFieldsValue({ award_id: last.award_id, persions: last.persions });
              _this.setState({ round: last.round, stop: false, pushable: true, selected: winner, alldata: response.data, tapable: true, makesure: true });
            } else {
              setFieldsValue({ award_id: last.award_id, persions: last.persions });
              _this.setState({ round: last.round, stop: false, selected: winner, alldata: response.data, tapable: true, makesure: true });
            }
          } else {
            if (last.winners.length) {
              setFieldsValue({ award_id: last.award_id, persions: last.persions });
              _this.setState({ round: last.round, rechoice: true, pushable: true, selected: winner, alldata: response.data, tapable: true, makesure: true });
            } else {
              setFieldsValue({ award_id: last.award_id, persions: last.persions });
              _this.setState({ round: last.round, start: false, selected: winner, alldata: response.data, tapable: true, makesure: true });
            }
          }
        } else {
          setFieldsValue({ award_id: last.award_id, persions: last.persions });
          _this.setState({ round: last.round, nextround: false, selected: winner, alldata: response.data, tapable: true, makesure: true });
        }
      }
    }
    request('/api/configuration', options, asd, (error) => this.errors(error));
  }

  errors = (error) => {
    if (error.response.status === 500) {
      message.error('服务器错误!');
    } else if (error.response.status === 403 || error.response.status === 400) {
      message.error(error.response.data.message);
    } else if (error.response.status === 422) {
      const miderr = Object.values(error.response.data.errors);
      message.error(miderr);
    }
  }

  makeSure = () => {
    const { getFieldsValue } = this.props.form;
    const _this = this;
    const params = getFieldsValue();
    const options = {
      type: 'post',
      params,
    }
    if (params.award_id && params.persions) {
      request('/api/configuration', options, (response) => _this.setState({ round: response.data.round, start: false, tapable: true, makesure: true }), (error) => this.errors(error));
    }
  }

  reSure = () => {
    const { getFieldsValue } = this.props.form;
    const { round } = this.state;
    const _this = this;
    const params = getFieldsValue();
    const options = {
      type: 'put',
      params,
    }
    if (params.persions && params.award_id) {
      request(`/api/configuration/${round}`, options, () => _this.setState({ start: false, tapable: true, makesure: true }), (error) => this.errors(error));
    }
  }

  sureClick = () => {
    const { round } = this.state;
    if (round) {
      this.reSure();
    } else {
      this.makeSure();
    }
  }

  retap = () => {
    const _this = this;
    _this.setState({ tapable: false, start: true, makesure: false });
  }

  startChoice = () => {
    const { round } = this.state;
    const _this = this;
    const options = {
      type: 'get',
      params: { round },
    }
    request('/api/start', options, () => _this.setState({ start: true, stop: false }), (error) => this.errors(error));
  }

  stopChoice = () => {
    const { round, pushable, selected } = this.state;
    const _this = this;
    const options = {
      type: 'get',
      params: { round },
    }
    function aaa(response) {
      if (!pushable) {
        _this.setState({ stop: true, nextround: false, selected: response.data });
      } else {
        const partSelected = response.data;
        partSelected.forEach(item => selected.push(item));
        _this.setState({ stop: true, nextround: false, selected, pushable: false })
      }
    }
    request('/api/stop', options, aaa, (error) => this.errors(error));
  }

  reChoice = () => {
    const { round } = this.state;
    const _this = this;
    const options = {
      type: 'get',
      params: { round },
    }
    request('/api/continue', options, () => _this.setState({ stop: false, nextround: true, pushable: true, rechoice: false }), (error) => this.errors(error));
  }

  delete = (id) => {
    const { selected, round } = this.state;
    const afterDeleted = selected.filter(item => item.openid !== id);
    const _this = this;
    const options = {
      type: 'patch',
      params: {
        round,
        openid: id,
      },
    };
    function gkd() {
      if (afterDeleted.length) {
        _this.setState({ selected: afterDeleted, rechoice: true, nextround: true })
      } else {
        _this.setState({ selected: afterDeleted, rechoice: false, nextround: true, start: false })
      }
    }
    request('/api/abandon_prize', options, gkd, (error) => this.errors(error));
  }

  fetchAwards = () => {
    const _this = this;
    const options = {
      type: 'get',
      params: {},
    }
    request('/api/award', options, (response) => _this.setState({ award: response.data }), (error) => this.errors(error));
  }

  clear = () => {
    const { resetFields } = this.props.form;
    const { inround } = this.state;
    resetFields();
    const _this = this;
    const options = {
      type: 'get',
      params: {},
    }
    _this.setState({ nextround: true, selected: [], round: null, tapable: false, inround: inround + 1 });
    request('/api/configuration', options, (response) => _this.setState({ alldata: response.data, makesure: false }), (error) => this.errors(error));
  }

  roundtitle = (item) => {
    return (
      <div>
        第{item.round}轮
    <span className='ddd'><Avatar size="small" src={item.award.url} />{item.award.name}</span>
        <span className='ccc'>抽{item.persions}人</span>
      </div>)
  }
  render() {
    const { award, inround, alldata, tapable, start, nextround, stop, selected, rechoice, makesure } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const number = getFieldValue('persions');
    const reSelected = !!!(selected.length !== number && !!number && rechoice);

    return (
      <div>
        <Row>
          <Col span={6} className='eee'>
            <List
              grid={{
                gutter: 8, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 1,
              }}
              dataSource={alldata}
              renderItem={item => (
                <List.Item className='bbb'>
                  <Card title={this.roundtitle(item)}>
                    {item.winners.map(kids => {
                      return (
                        <Tag key={kids.openid} >
                          <Tooltip title={kids.sign.mobile}>
                            <Avatar size="small" src={kids.sign.avatar} />{kids.sign.name}
                          </Tooltip>
                        </Tag>
                      )
                    })}
                  </Card>
                </List.Item>
              )}
            />
          </Col>
          <Col span={16}>
            <Form>
              <Row>
                <Col span={8} offset={6}>
                  <FormItem {...formItemLayout} label="当前轮次" >{inround}</FormItem>
                </Col>
                <Col span={8} offset={6}>
                  <FormItem {...formItemLayout} label="奖项选择" required>
                    {getFieldDecorator('award_id',
                    )(
                      <Select disabled={tapable} >
                        {award.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col><Button onClick={() => this.fetchAwards()} icon='sync' style={{ float: "right", position: "absolute", marginTop: 67 }} /></Col>
                <Col span={8} offset={6}>
                  <FormItem {...formItemLayout} label="人数" required>
                    {getFieldDecorator('persions')(
                      <InputNumber disabled={tapable} />
                    )}
                  </FormItem>
                </Col>
                <Col span={10} offset={7}>
                  <Button onClick={() => this.sureClick()} disabled={makesure}>确定</Button>
                  <Button onClick={() => this.retap()} disabled={start}>修改</Button>
                  <Button onClick={() => this.startChoice()} disabled={start}>开始抽奖</Button>
                  <Button onClick={() => this.reChoice()} disabled={reSelected}>补充抽奖</Button>
                  <Button onClick={() => this.stopChoice()} disabled={stop}>停止抽奖</Button>
                  <Button onClick={() => this.clear()} disabled={nextround}>下一轮</Button>
                </Col>
                <Col span={10} offset={7}>
                  <div className='aaa'>
                    {selected.map(item => {
                      return (
                        <Tag key={item.openid} closable={true} afterClose={() => this.delete(item.openid)}>
                          <Tooltip title={item.mobile}>
                            <Avatar size="mid" src={item.avatar} />{item.name}
                          </Tooltip>
                        </Tag>
                      )
                    })}
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()(XX)
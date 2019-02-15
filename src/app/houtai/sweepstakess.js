import React, { PureComponent } from 'react';
import axios from 'axios';
import { Row, Col, Form, Select, Input, Button, Tag, List, Card, Avatar } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class XX extends PureComponent {
  state = {
    alldata: [],
    makesure: false,
    start: true,
    stop: true,
    nextround: true,
    round: null,
    pushable: false,
    rechoice: false,
    selected: [],
  }

  componentDidMount() {
    const _this = this;
    axios.get('/api/configuration'
    )
      .then(function (response) {
        _this.setState({ alldata: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  makeSure = () => {
    const { getFieldsValue } = this.props.form;
    const _this = this;
    const params = getFieldsValue();
    axios.post('/api/configuration',
      params
    )
      .then(function (response) {
        _this.setState({ round: response.data.round, makesure: true, start: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  startChoice = () => {
    const { round } = this.state;
    const _this = this;
    axios.get('/api/start',
      {
        params: {
          round
        }
      }
    )
      .then(function (response) {
        _this.setState({ start: true, stop: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  stopChoice = () => {
    const { round, pushable, selected } = this.state;
    const _this = this;
    axios.get('/api/stop',
      {
        params: {
          round
        }
      }
    )
      .then(function (response) {
        if (!pushable) {
          _this.setState({ stop: true, nextround: false, selected: response.data });
        } else {
          const partSelected = response.data;
          partSelected.forEach(item => selected.push(item));
          _this.setState({ stop: true, nextround: false, selected, pushable: false })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  reChoice = () => {
    const { round } = this.state;
    const _this = this;
    axios.get('/api/continue',
      {
        params: {
          round
        }
      }
    )
      .then(function (response) {
        _this.setState({ stop: false, nextround: true, pushable: true, rechoice: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  delete = (id) => {
    const { selected, round } = this.state;
    const afterDeleted = selected.filter(item => item.openid !== id);
    const _this = this;
    _this.setState({ selected: afterDeleted, rechoice: true, nextround: true });
    axios.patch('/api/abandon_prize',
      {
        round,
        openid: id,
      }
    )
      .then(function (response) {

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  clear = () => {
    const { resetFields } = this.props.form;
    resetFields();
    const _this = this;
    _this.setState({ makesure: false, nextround: true, selected: [] });
    axios.get('/api/configuration'
    )
      .then(function (response) {
        _this.setState({ alldata: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { alldata, start, nextround, stop, makesure, selected, rechoice } = this.state;
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
    const reSelected = !!!(selected.length.toString() !== number && !!number && rechoice);
    return (
      <div>
        <Row>
          <Col span={5}>
            <List
              grid={{
                gutter: 8, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 2,
              }}
              dataSource={alldata}
              renderItem={item => (
                <List.Item>
                  <Card title={'第' + item.round + '轮'}>
                    {item.winners.map(kids => {
                      return (
                        <Tag key={kids.openid} ><Avatar size="small" src={kids.sign.avatar} />{kids.sign.name}@{kids.sign.mobile}</Tag>
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
                  <FormItem {...formItemLayout} label="奖项选择" >
                    {getFieldDecorator('award_id')(
                      <Select>
                        <Option value="1">一等奖</Option>
                        <Option value="2">二等奖</Option>
                        <Option value="3">三等奖</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={6}>
                  <FormItem {...formItemLayout} label="人数" >
                    {getFieldDecorator('persions')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={9}>
                  <Button onClick={() => this.makeSure()} hidden={makesure}>确定</Button>
                  <Button onClick={() => this.startChoice()} hidden={start}>开始抽奖</Button>
                  <Button onClick={() => this.reChoice()} hidden={reSelected}>再次抽奖</Button>
                  <Button onClick={() => this.stopChoice()} hidden={stop}>停止抽奖</Button>
                  <Button onClick={() => this.clear()} hidden={nextround}>下一轮</Button>
                </Col>
                <Col span={12} offset={7}>
                  <div>
                    {selected.map(item => { return <Tag key={item.openid} closable={true} afterClose={() => this.delete(item.openid)}>{item.name}</Tag> })}
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
import React, { PureComponent } from 'react';
import axios from 'axios';
import { Row, Col, Form, Select, InputNumber, Button, Tag, List, Card, Avatar, Tooltip } from 'antd';
import { debounce } from 'lodash';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

class XX extends PureComponent {
  state = {
    alldata: [],
    award: [],
    tapable: false,
    start: true,
    stop: true,
    nextround: true,
    round: null,
    inround: 1,
    pushable: false,
    rechoice: false,
    selected: [],
  }

  debounce1 = debounce((params) => {
    this.makeSure(params)
  }, 1500)

  debounce2 = debounce((params) => {
    this.reSure(params)
  }, 1500)

  componentDidMount() {
    const _this = this;
    const { setFieldsValue } = this.props.form;
    axios.get('/api/award')
      .then(function (response) {
        _this.setState({ award: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('/api/configuration'
    )
      .then(function (response) {
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
                _this.setState({ round: last.round, stop: false, pushable: true, selected: winner, alldata: response.data, tapable: true });
              } else {
                setFieldsValue({ award_id: last.award_id, persions: last.persions });
                _this.setState({ round: last.round, stop: false, selected: winner, alldata: response.data, tapable: true });
              }
            } else {
              if (last.winners.length) {
                setFieldsValue({ award_id: last.award_id, persions: last.persions });
                _this.setState({ round: last.round, rechoice: true, pushable: true, selected: winner, alldata: response.data, tapable: true });
              } else {
                setFieldsValue({ award_id: last.award_id, persions: last.persions });
                _this.setState({ round: last.round, start: false, selected: winner, alldata: response.data, tapable: true });
              }
            }
          } else {
            setFieldsValue({ award_id: last.award_id, persions: last.persions });
            _this.setState({ round: last.round, nextround: false, selected: winner, alldata: response.data, tapable: true });
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  makeSure = () => {
    const { getFieldsValue } = this.props.form;
    const _this = this;
    const params = getFieldsValue();
    if (params.award_id && params.persions) {
      axios.post('/api/configuration',
        params
      )
        .then(function (response) {
          _this.setState({ round: response.data.round, start: false, tapable: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  reSure = () => {
    const { getFieldsValue } = this.props.form;
    const { round } = this.state;
    const _this = this;
    const params = getFieldsValue();
    if (params.persions && params.award_id) {
      axios.put(`/api/configuration/${round}`,
        params
      )
        .then(function (response) {
          _this.setState({ start: false, tapable: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  onChange = () => {
    const { round } = this.state;
    if (round) {
      this.debounce2();
    } else {
      this.debounce1();
    }
  }

  retap = () => {
    const _this = this;
    _this.setState({ tapable: false, start: true });
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
    const { inround } = this.state;
    resetFields();
    const _this = this;
    _this.setState({ nextround: true, selected: [], round: null, tapable: false, inround: inround + 1 });
    axios.get('/api/configuration'
    )
      .then(function (response) {
        _this.setState({ alldata: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  roundtitle = (item) => { return (
    <div>
    第{item.round}轮
    <span className='ddd'><Avatar size="small" src={item.award.url} />{item.award.name}</span>
    <span className='ccc'>抽{item.persions}人</span>
    </div>) }
  render() {
    const { award, inround, alldata, tapable, start, nextround, stop, selected, rechoice } = this.state;
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
                      <Select onChange={() => this.onChange()} disabled={tapable} >
                        {award.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={6}>
                  <FormItem {...formItemLayout} label="人数" required>
                    {getFieldDecorator('persions')(
                      <InputNumber  onChange={() => this.onChange()} disabled={tapable} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={7}>
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
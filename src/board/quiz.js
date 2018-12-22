import React from 'react';
import axios from 'axios';
import Avatar from 'components/Avatar';
import './quiz.less';
import questions from './questions.json';
import quizCover from 'public/quiz_cover.png';
import progressBgDanger from 'public/progress_bg_danger.png';
import clock from 'public/clock.png';
import countDownGif from 'public/count_down.gif';

class QuizBoard extends React.Component {
  state = {
    start: false,
    showCountDown: true,
    index: 1,
    showAnswer: false,
    top: null,
    result: false,
  }

  componentWillMount() {
    document.addEventListener('keyup', this.handleStart);
  }

  handleStart = (e) => {
    e.preventDefault();
    const { index } = this.state;
    if (e.keyCode === 13) {
      document.removeEventListener('keyup', this.handleStart);
      this.setState({ start: true }, () => {
        this.showQuestion(index);
      });
    }
  }

  handleNextQuestion = (e) => {
    e.preventDefault();
    const { index } = this.state;
    if (e.keyCode === 39) {
      document.removeEventListener('keyup', this.handleNextQuestion);
      document.removeEventListener('keyup', this.showTopList);
      const nextIndex = index + 1;
      this.showQuestion(nextIndex);
    }
  }

  showQuestion = (index) => {
    this.setState({ showCountDown: true, showAnswer: false }, () => {
      setTimeout(() => {
        axios.get(`/api/start?round=${index}`);
        this.setState({ index, showCountDown: false }, this.questionCountDown);
      }, 2900);
    });

  }

  questionCountDown = () => {
    const { index } = this.state;
    setTimeout(() => {
      const progressBox = document.getElementsByClassName('progress')[0];
      progressBox.getElementsByTagName('div')[0].style.width = 0;
    }, 10);
    setTimeout(() => {
      const progressBox = document.getElementsByClassName('progress')[0];
      progressBox.style.borderColor = '#d0021b';
      progressBox.getElementsByTagName('div')[0].style.backgroundImage = `url(${progressBgDanger})`;
    }, 7000);
    setTimeout(() => {
      this.setState({ showAnswer: true }, () => {
        document.addEventListener('keyup', this.showTopList);
      });
      if (index < 10) {
        document.addEventListener('keyup', this.handleNextQuestion);
      } else {
        document.addEventListener('keyup', this.showResult);
      }
    }, 10000);
  }

  showTopList = (e) => {
    e.preventDefault();
    const { index } = this.state;
    if (e.keyCode === 84) {
      axios.get(`/api/top?round=${index}`).then((res) => {
        this.setState({ top: res.data.top }, () => {
          setTimeout(() => {
            document.getElementById('top-list').getElementsByTagName('div')[0].style.transform = 'scale(1,1)';
          }, 1);
          document.addEventListener('keyup', this.hideTopList);
        });
      });
    }
  }

  hideTopList = (e) => {
    e.preventDefault();
    if (e.keyCode === 27) {
      document.removeEventListener('keyup', this.hideTopList);
      this.setState({ top: null });
    }
  }

  makeProgress = () => {
    const { index } = this.state;
    return (
      <div className="progress" key={`progress-${index}`}>
        <div />
      </div>
    );
  }

  makeOptions = (question) => {
    const { showAnswer } = this.state;
    return ['a', 'b', 'c', 'd'].map((index) => {
      return (
        <div
          key={index}
          className={showAnswer ? (question.answer === index ? 'right-answer' : 'wrong-answer') : ''}
        >
          <span>{index.toUpperCase()}</span>、{question[index]}
        </div>
      );
    });
  }

  makeTopList = () => {
    const { top } = this.state;
    return (
      <div id="top-list">
        <div>
          {top.filter((staff, index) => index < 3).map((staff) => {
            return (
              <div key={staff.user_id}>
                <Avatar width="96px" src={staff.avatar} style={{ float: 'left', marginRight: '30px' }} />
                <span className="name">{staff.name}</span>
                <span className="score">+{staff.score}</span>
                <span className="time">
                <img src={clock} />{(Math.floor(staff.time / 100) / 10).toFixed(1)}s
              </span>
              </div>);
          })}
        </div>
      </div>
    );
  }

  showResult = (e) => {
    e.preventDefault();
    if (e.keyCode === 39) {
      document.removeEventListener('keyup', this.showResult);
      document.removeEventListener('keyup', this.showTopList);
      axios.get(`/api/all-top`).then((res) => {
        this.setState({ result: res.data });
      });
    }
  }

  render() {
    const { start, showCountDown, index, top, result } = this.state;
    const question = questions[index - 1];

    if (result) {
      return (
        <div className="result">
          <div className="top-3">
            {result.map((user, index) => {
              if (index < 3) {
                return (
                  <div>
                    <Avatar width="96px" src={user.avatar} />
                    <span className="name" title={user.name}>{user.name}</span>
                    <span className="score">{user.score}</span>
                    <span className="time">
                    <img src={clock} />
                      {(user.total_time / (user.number * 1000)).toFixed(3)} s/题
                  </span>
                  </div>
                );
              }
            })}
          </div>
          <div className="top-8">
            {result.map((user, index) => {
              if (index >= 3 && index < 8) {
                return (
                  <div>
                    <Avatar width="72px" src={user.avatar} />
                    <span className="name" title={user.name}>{user.name}</span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    } else if (start) {
      return (
        <React.Fragment>
          {showCountDown ? (
            <img key={`count-down-${index}`} className="count-down" src={countDownGif} />
          ) : (
            <div className="question-box">
              {this.makeProgress()}
              {index}、{question.q}
              <div className="options">
                {this.makeOptions(question)}
              </div>
            </div>
          )}
          {top && this.makeTopList()}
        </React.Fragment>
      );
    } else {
      return <img className="cover" src={quizCover} />;
    }
  }
}

export default QuizBoard;
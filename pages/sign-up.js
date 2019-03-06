import React, { Component } from 'react';
import Router from 'next/router';
import fb from '../config/firebase';

import MainView from '../components/layout/MainView';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        phone: '',
        checkPassword: false,
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });

        if ((this.state.password !== '' && this.state.password2 !== '') && (this.state.password == this.state.password2)) {
            this.setState({
                checkPassword: true,
            })
        }
    }

    signUp = (e) => {
        e.preventDefault();

        fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            console.log('회원가입에 성공했습니다.', user);
            const { email } = user.user.providerData[0];
            const firstDisplayName = email.split('@')[0];

            fb.auth().currentUser.updateProfile({
                displayName: firstDisplayName,
            }).then(res => {
                Router.push('/');
            });
            this.setState({
                name: '',
                email: '',
                passwsord: '',
                passwsord2: '',
                phone: '',
                checkPassword: false,
            })
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
                <MainView>
                <style jsx>{`
                    .sign-container {
                        margin-left: 16px;
                        margin-right: 16px;
                        max-width: 550px;
                    }
                    form {
                    }
                    .page-title-box {
                        margin-top: 3rem;
                        margin-bottom: 3rem;
                    }
                    .page-title {
                        font-size: 2rem;
                    }
                    .page-desc {
                        line-height: 1.6;
                        font-size: 1rem;
                    }
                    input {
                        box-sizing: border-box;
                        margin-bottom: 0.5rem;
                        padding: 10px;
                        border: 1px solid #e0e0e0;
                        width: 100%;
                        border-radius: 4px;
                        height: 50px;
                        font-size: 1rem;
                        color: #212121;
                    }
                    .section {
                        margin-bottom: 2rem;
                    }
                    .section-contents {
                        margin-bottom: 2rem;
                    }
                    .contents-title {
                        font-size: 1rem;
                        color: #9e9e9e;
                    }
                    .contents-desc {
                        font-size: 0.8rem;
                        color: #757575;
                    }
                    .button-box {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                    }
                    input[type=submit] {
                        width: 160px;
                        background-color: #2196f3;
                        color: #fff;
                        cursor: pointer;
                        outline: none;
                    }
                    input[type=submit]:hover {
                        box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                    }
                `}</style>
                <div className="sign-container">
                    <div className="page-title-box">
                        <p className="page-title">teamteam에 오신 것을 환영합니다!</p>
                        <p className="page-desc"><strong>축구를 하고 싶은 사람들</strong>이 기다리고 있습니다.<br />지금 당장 <strong>경기를 만들거나 참여</strong>하세요!</p>
                    </div>
                    <form 
                        onSubmit={this.signUp}
                    >
                        <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">이름</p>
                                    <input
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        name="name"
                                        type="text"
                                    />
                                </div>
                                <p className="error-msg"></p>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">이메일</p>
                                    <input
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        name="email"
                                        type="email"
                                    />
                                </div>
                                <p className="error-msg"></p>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">비밀번호</p>
                                    <input
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        name="password"
                                        type="password"
                                    />
                                    <p className="contents-desc">한 번 더 입력해주세요.</p>
                                    <input
                                        value={this.state.password2}
                                        onChange={this.handleChange}
                                        name="password2"
                                        type="password"
                                    />
                                </div>
                                <p className="error-msg"></p>
                            </div>
                            <div className="section">
                                <div className="section-contents">
                                    <p className="contents-title">휴대폰 번호</p>
                                    <input
                                        placeholder="'-'를 제외하고 입력해주세요."
                                        value={this.state.phone}
                                        onChange={this.handleChange}
                                        name="phone"
                                        type="number"
                                    />
                                </div>
                                <p className="error-msg"></p>
                            </div>
                            <div className="button-box">
                                <input
                                    type="submit"
                                    value="완료"
                                />
                            </div>
                    </form>
                </div>
            </ MainView>
        );
    }
}

export default SignUp;
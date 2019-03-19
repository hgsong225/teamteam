import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import fb from '../config/firebase';

import MainView from '../components/layout/MainView';

import '../style/sign-in.css';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });

        if (this.state.password == this.state.password2) {
            this.setState({
                checkPassword: true,
            })
        }
    }

    signIn = (e) => {
        e.preventDefault();
        fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            console.log('로그인에 성공했습니다.', user);
            Router.push({
                pathname: '/'
            });
            this.setState({
                name: '',
                password: '',
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <MainView>
                <style jsx>{`
                `}</style>
                <div className="sign-container">
                    <p className="page-title">로그인</p>
                    <form
                        onSubmit={this.signIn}
                    >
                        <div className="section">
                            <div className="section-contents">
                                <p className="contents-title">이메일</p>
                                <p className="contents-desc"></p>
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
                                <p className="contents-desc"></p>
                                <input
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password"
                                />
                            </div>
                            <p className="error-msg"></p>
                        </div>
                        <div className="button-box">
                            <Link href='/sign-up'><a>teamteam에 처음 오셨나요?</a></Link>
                            <input
                                type="submit"
                                value="로그인"
                            />
                        </div>
                    </form>
                </div>
            </MainView>
        );
    }
}

export default SignUp;
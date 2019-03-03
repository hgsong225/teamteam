import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import fb from '../config/firebase';

import Header from '../components/smart/layout/Header';

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
            <div>
                <Header />
                teamteam에 로그인하기
                <form
                    onSubmit={this.signIn}
                >
                    <label>이메일</label>
                    <br />
                    <input
                        value={this.state.email}
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                    />
                    <br />
                    <label>비밀번호</label>
                    <br />
                    <input
                        value={this.state.password}
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                    />
                    <br />
                    <button>로그인</button>
                 </form>
                 <Link href='/sign-up'><a>teamteam에 처음 오셨나요?</a></Link>
            </div>
        );
    }
}

export default SignUp;
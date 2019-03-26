//추후 Container로 작업 할 것
import React, { Component } from 'react';
import fb from '../config/firebase';

import Header from '../components/layout/Header';

class Auth extends Component {
    state = {
        user: {},
        email: '',
        password: '',
        password2: '',
        checkPassword: false,
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
            } else {
                this.setState({
                    user: null,
                });
            }
        })
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
            console.log(user);
            this.setState({
                name: '',
                passwsord: '',
                passwsord2: '',
                checkPassword: false,
            })
        })
        .catch(err => {
            console.log(err);
        });
    }

    signIn = (e) => {
        e.preventDefault();
        fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            console.log('로그인에 성공했습니다.', user);
            this.setState({
                name: '',
                password: '',
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    signOut() {
        fb.auth().signOut();
        console.log('로그아웃 완료');
    }

    render() {
        return (
            <div>
            <Header />
            {this.state.user ? '로그인 완료' : '로그인 필요'}
            이메일로 로그인
            <form
                onSubmit={this.signIn}
            >
                <input
                    placeholder="이메일"
                    value={this.state.email}
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                />
                <input
                    placeholder="비밀번호"
                    value={this.state.password}
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                />
                <button>로그인</button>
            </form>
            
            회원가입
            <form 
                onSubmit={this.signUp}
            >
                <input
                    placeholder="이메일"
                    value={this.state.email}
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                />
                <input
                    placeholder="비밀번호"
                    value={this.state.password}
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                />
                <input
                    placeholder="비밀번호를 한 번 더 입력해주세요."
                    value={this.state.password2}
                    onChange={this.handleChange}
                    name="password2"
                    type="password"
                />
                <button type="submit">완료</button>
            </form>
            <button
                onClick={this.signOut}
            >
                로그아웃
            </button>
        </div>
        );
    }
}

export default Auth;

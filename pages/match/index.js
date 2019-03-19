import React, { Component }from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';

import fb from '../../config/firebase';

import Layout from '../../components/layout/Layout';

class Match extends Component {
    copyTarget = React.createRef()

    state = {
        user: null,
        match: [],
        applicants: [],
        completedPaymentForApplicant: [],
        /* 내 신청 정보 */
        myApplicationInfo: [],
        didIApply: false,
        didICompletedPayment: false,
    }
    
    componentDidMount() {
        console.log('컴포넌트디드마운트 실행 in match');
        this.authListener();
    }

    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
                this.getMyApplicationInfo(user);
                this.getApplicants(user);
                this.getMatch();
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    getMatch = () => {
        const self = this;
        const { url } = this.props;
        const params = {
            id: url.query.id,
        };
        axios.get('http://localhost:3333/api/match', {
            params,
        })
        .then((res) => {
            self.setState({
                match: res.data,
            });
        })
        .catch((err) => console.log(err));
    }

    getMyApplicationInfo = (user) => {
        const self = this;
        const { url } = this.props;
        console.log(user);
        const params = {
            uid: user.uid,
            idmatch: url.query.id,
        };
        axios.get('http://localhost:3333/api/match/applicant/me', {
            params,
        })
        .then(res => {
            const myApplicationInfo = res.data;
            const didIApply = myApplicationInfo.length > 0 && true; // 신청했는지 확인
            const didICompletedPayment = myApplicationInfo[0].payment_status === '결제완료' && true; // 결제 했는지 확인
            self.setState({
                myApplicationInfo,
                didIApply,
                didICompletedPayment,
            });
        })
        .catch(err => console.log(err));
    }

    getApplicants = (user) => {
        const self = this;
        const { url } = this.props;
        console.log(user);
        const params = {
            uid: user.uid,
            id: url.query.id,
        };
        axios.get('http://localhost:3333/api/match/applicants', {
            params,
        })
        .then((res) => {
            const applicants = res.data;
            const completedPaymentForApplicant = applicants.filter(applicant => applicant.payment_status === '결제완료'); // 결제 완료한 신청자

            self.setState({
                applicants: res.data,
                completedPaymentForApplicant,
            });
        })
        .catch((err) => console.log(err));
    }

    handleApplicant = (e) => { // 신청 관리
        e.preventDefault();
        const iduser = e.target.name;
        const applicant_status = e.target.value;
        const { match } = this.state;
        
        console.log(applicant_status, iduser, match[0].idmatch);

        axios.post('http://localhost:3333/api/match/me/apply', {
            data: {
                applicant_status,
                idmatch: match[0].idmatch,
                iduser: Number(iduser)
            }
        })
        .then((res) => {
            this.getApplicants(this.state.user);
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    applyMatch = (e) => {
        e.preventDefault();
        console.log('applyMatch BUTTON입니다.', e.target);
        axios.post('http://localhost:3333/api/match/apply', {
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    cancelApply = (e) => {
        e.preventDefault();
        console.log(`cancelApply BUTTON 입니다.`, e.target);
        axios.post('http://localhost:3333/api/match/apply/cancel', {
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    cancelMatch = (e) => {
        e.preventDefault();
        console.log(`cancelMatch BUTTON 입니다.`, e.target);
        axios.post('http://localhost:3333/api/match/me/cancel', {
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
    
    removeMatch = (e) => {
        console.log(`removeMatch BUTTON 입니다.`, e.target);
        const idpost = e.target.getAttribute('name');
        const params = {
            idpost,
        };

        if (confirm("삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?")) {
            axios.delete('http://localhost:3333/api/match/me', {
                params,
            })
            .then((res) => {
                console.log(res);
                alert('삭제 완료');
                Router.push('/');
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        const { match, applicants } = this.state;
        
        return (
                <Layout user={this.state.user}>
                    <style jsx>{`
                        .post-container {
                            max-width: 720px;
                        }
                        .notice-box {
                            margin-top: 2rem;
                            margin-bottom: 2rem;
                        }
                        .notice {
                            font-size: 2rem;
                            margin: 0;
                            margin-bottom: 2rem;
                        }
                        .post-box {
                            margin-bottom: 1.5rem;
                            padding: 0.5rem;
                            border-bottom: 1px solid #e0e0e0;
                        }
                        #intro {
                            height: 100%;
                            padding: 0.9rem;
                            background-color: #fafafa;
                            border-radius: 4px;
                            line-height: 1.5;
                        }
                        .desc-title {
                            font-size: 0.9rem;
                            color: #9e9e9e;
                        }
                        .place {
                            margin-bottom: 0rem;
                        }
                        .info {
                            font-size: 1.2rem;
                        }
                        .address #copy{
                            font-size: 0.9rem;
                        }
                        #copy {
                            color: #42a5f5;
                            cursor: pointer;
                        }
                        select, input {
                            margin-bottom: 0.5rem;
                            width: 100%;
                            max-width: 550px;
                            height: 50px;
                            font-size: 16px;
                            color: #212121;
                            padding: 10px;
                            border: 1px solid #e0e0e0;
                            border-radius: 4px;
                        }
                        input {
                            box-sizing: border-box;
                        }
                        .applicants {
                            border-collapse: collapse;
                            margin-bottom: 16px;
                            width: 100%;
                        }
                        th, td {
                            text-align: center;
                        }
                        td {
                            height: 80px;
                        }
                        .response-box {
                            display: table-cell;
                        }
                        .response-box button {
                            margin: 0 8px;
                            padding: 0;
                            border: none;
                            background-color: inherit;
                        }
                        .allow {
                            display: inline-block;
                            color: #2196f3;
                        }
                        .reject {
                            display: inline-block;
                            color: #f44336;
                        }
                        .apply-button {
                            width: 160px;
                            outline: none;
                            margin: 0;
                            cursor: pointer;
                            display: inline-block;
                            text-decoration: none;
                            border: none;
                            background-color: #1e88e5;
                            font-size: 16px;
                            color: white;
                            padding: 1px 120px;
                            text-align: center;
                            box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                        }
                        .price-text {
                            margin-top: 0px;
                            font-size: 1rem;
                        }
                        .button-box {
                            display: flex;
                            justify-content: space-around;
                            margin-top: 20px;
                            width: 100%;
                        }
                        input[type=submit] {
                            width: 160px;
                            color: #fff;
                            cursor: pointer;
                            outline: none;
                            border: none;
                        }
                        .apply, .cancel-apply {
                            margin-bottom: 8px;
                            font-size: 1rem;
                        }
                        .apply {
                            background-color: #2196f3;
                        }
                        .apply:hover {
                            box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                        }
                        .apply-button:hover {
                            background-color: #42a5f5;
                            box-shadow: 0 12px 12px 0 rgba(0,0,0,0.24)
                        }

                        .cancel-apply {
                            background-color: #9e9e9e;
                        }
                        @media screen and (max-width: 414px) {
                            .button-box {
                                z-index: 4;
                                position: fixed;
                                left: 0;
                                bottom: 0;
                                justify-content: center;
                                width: 100%;
                                padding: 20px 0;
                                border-top: 1px solid #e1e1e1;
                                background-color: #fafafa;
                            }
                        }
                    `}</style>
                    <div className="post-container">
                        {
                            match.length > 0 &&
                            <div className="post">
                                {/* <div className="notice-box">
                                    <p className="notice">{match[0].apply_status}, {match[0].total_guest}명 남음</p>
                                </div> */}
                                <div id="intro">
                                    <p>{match[0].display_name} {this.state.didICompletedPayment === true && match[0].phone}</p>
                                    <div>
                                        <p>{match[0].contents}</p>
                                    </div>
                                </div>
                                <div className="post-box">
                                    <h3>경기 정보</h3>
                                    <div>
                                        <p className="desc-title">경기장</p>
                                        <p className="info place">{match[0].place_name}</p>
                                        <span
                                            className="address"
                                            ref={this.copyTarget}
                                            value={match[0].address}
                                        >
                                            {match[0].address} 
                                        </span>
                                        <span
                                            id="copy"
                                            onClick={this.copy}
                                        >
                                        주소 복사</span>
                                    </div>
                                    <div>
                                        <p className="desc-title">경기 일시</p>
                                        <p className="info">{match[0].start_time.slice(0, 4)}년 {match[0].start_time.slice(5, 7)}월 {match[0].start_time.slice(8, 10)}일 {match[0].start_time.slice(11, 16)} - {match[0].end_time.slice(11, 16)}</p>
                                    </div>
                                    <div>
                                        <p className="desc-title">종목</p>
                                        <p className="info">{match[0].sports_category} {match[0].match_type} : {match[0].match_type}</p>
                                    </div>
                                </div>
                                <div className="post-box">
                                    <h3>결제</h3>
                                    <p>o 계좌 이체</p>
                                    <div>
                                        <p className="desc-title">입금 계좌</p>
                                        <p className="info">신한 110-439-532672 팀팀</p>
                                        <p>- 입금자 순으로 신청 확정됩니다.</p>
                                        <p>- 당일 경기 취소시 환불은 불가합니다.</p>
                                        <p>- 입금 확인 후프로필에 등록하신 연락처로 경기 안내가 발송됩니다.</p>
                                        <p>- 입금 확인 후 경기 주최자의 연락처가 공개됩니다.</p>
                                    </div>
                                </div>
                                {
                                    this.state.user !== null &&
                                    (
                                        match[0].fb_uid == this.state.user.uid &&
                                        <div className="post-box">
                                            <h3>신청 상태</h3>
                                            <p>신청 상태는 호스트만 볼 수 있습니다.</p>
                                            {
                                                (applicants.length > 0 && applicants.filter(applicant => applicant.applicant_status !== '신청취소(거절)').length > 0)
                                                ? <table className="applicants">
                                                    <thead>
                                                        <tr>
                                                            <th>이름</th>
                                                            <th>신청 일시</th>
                                                            <th>신청 상태</th>
                                                            <th>입금 상태</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        applicants.map((applicant, i) => {
                                                            return applicant.applicant_status !== '신청취소(거절)' && (
                                                                <tr
                                                                    key={i * 2}
                                                                >
                                                                    <td>{applicant.name}</td>
                                                                    <td>{applicant.apply_time.slice(0, 4)}년 {applicant.apply_time.slice(5, 7)}월 {applicant.apply_time.slice(8, 10)}일 {applicant.apply_time.slice(11, 16)}분</td>
                                                                    <td>{applicant.applicant_status}</td>
                                                                    <td>{applicant.payment_status}</td>
                                                                    {
                                                                        // 결제 완료일 경우
                                                                        applicant.payment_status === '결제완료' &&
                                                                        <td className="response-box">
                                                                            <button
                                                                                className="allow"
                                                                                onClick={this.handleApplicant}
                                                                                name={applicant.user_iduser}
                                                                                value="수락"
                                                                                >
                                                                                    수락
                                                                            </button>
                                                                            <button
                                                                                className="reject"
                                                                                onClick={this.handleApplicant}
                                                                                name={applicant.user_iduser}
                                                                                value="신청취소(거절)"
                                                                            >
                                                                                거절
                                                                            </button>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                    </tbody>
                                                </table>
                                                : <p>신청자가 없습니다.</p>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        }
                            {
                                (match.length > 0 && this.state.user !== null) &&
                                (
                                    match[0].fb_uid == this.state.user.uid
                                    ? <div>
                                        <div>
                                            <Link prefetch href='/profile/edit'><a>수정하기</a></Link>
                                        </div>
                                        {
                                            this.state.completedPaymentForApplicant.length > 0
                                            ? <button
                                                className="cancel-match"
                                                onClick={this.cancelMatch}
                                                name={match[0].idmatch}
                                            >
                                                경기 취소
                                            </button>
                                            : <button
                                                className="delete-match"
                                                onClick={this.removeMatch}
                                                name={match[0].idpost}
                                            >
                                                경기 삭제
                                            </button>
                                        }
                                    </div>
                                    // 신청 취소, 신청 상태 보여주기
                                    : (
                                        !this.state.didIApply || this.state.myApplicationInfo[0].applicant_status === '신청취소(거절)'
                                        ? <div className="button-box">
                                            <input
                                                className="apply"
                                                onClick={this.applyMatch}
                                                value="신청하기"
                                                type="submit"
                                            />
                                        </div>
                                        : <div className="button-box">
                                            <input
                                                className="cancel-apply"
                                                onClick={this.cancelApply}
                                                value="신청 취소"
                                                type="submit"
                                            />
                                        </div>
                                    )
                                )
                            }
                    </div>
                </Layout>
        );
    }
}

export default Match;

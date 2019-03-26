import React, { Component }from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';

import fb from '../../config/firebase';

import Layout from '../../components/layout/Layout';

import '../../style/match-index.css';

class Match extends Component {
    copyTarget = React.createRef()

    state = {
        user: null,
        match: [],
        applicants: [],
        completedPaymentForApplicants: [],
        acceptedApplicants: [],
        /* 내 신청 정보 */
        myApplicationInfo: [],
        didIApply: false,
        didICompletedPayment: false,
    }
    
    componentDidMount() {
        console.log('컴포넌트디드마운트 실행 in match');
        this.authListener();
        const script = document.createElement("script");
        document.body.appendChild(script);
        // script.onload = () => {
        //     setTimeout(() => {
        //         const places = daum && new daum.maps.services.Places();
        //         console.log(places);
        //         this.setState({ places });
        //     }, 10000);
        // };
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7aa07991d231ab8c2de8a2ca3feca8e6&autoload=false&libraries=services";
        script.async = true;
        document.body.appendChild(script);
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
            const match = res.data;
            self.setState({
                match,
            });
            const lat = match[0].place_latitude;
            const lon = match[0].place_longtitude;
            this.drawMap(lat, lon);
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
            console.log(`myApplicationInfo`, myApplicationInfo);
            const didIApply = myApplicationInfo.length > 0 && true; // 신청했는지 확인
            const didICompletedPayment = (didIApply && myApplicationInfo[0].payment_status === '결제완료') && true; // 결제 했는지 확인
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
            const completedPaymentForApplicants = applicants.filter(applicant => applicant.payment_status === '결제완료'); // 결제 완료한 신청자
            const acceptedApplicants = completedPaymentForApplicants.filter(applicant => applicant.applicant_status === '수락') // 수락 된 신청자
            self.setState({
                applicants: res.data,
                completedPaymentForApplicants,
                acceptedApplicants,
            });
        })
        .catch((err) => console.log(err));
    }

    handleApplicant = (e) => { // 호스트의 신청 관리
        e.preventDefault();
        const iduser = e.target.name;
        let applicant_status = e.target.value;
        const { match } = this.state;
        console.log(`applicant_status`, applicant_status);

        const cancel = {
            cancel_type: '거절',
            reason_for_cancel: '호스트(신청거절)',
            refund_status: '환불전',
            refund_fee_rate: 1,
        }
        if (applicant_status == '신청취소') {
           cancel.refund_fee = this.state.applicants.filter(applicant => applicant.iduser == iduser)[0].amount_of_payment * cancel.refund_fee_rate;
        }

        axios.post('http://localhost:3333/api/match/applicants', {
            data: {
                idmatch: match[0].idmatch,
                iduser: Number(iduser),
                applicant_status,
                cancel: applicant_status == '신청취소' ? cancel : null,
            }
        })
        .then((res) => {
            this.getApplicants(this.state.user);
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    handlePrompt = (e) => {
        let depositor = prompt('입금자명을 입력하세요.');
        console.log(depositor);
        if (depositor == null) {
            e.preventDefault();
            alert('신청 취소');
            return; 
        }
        if (depositor.length !== 0) {
            if (confirm(`입금자명: '${depositor}' 님이 맞습니까? \n입금자명을 잘 확인해주세요.`)) {
                e.preventDefault();
                this.applyMatch(e, depositor);
            } else {
                e.preventDefault();
                return alert('신청 취소');
            }
        } else {
            return this.handlePrompt(e);
        }
    }

    applyMatch = (e, depositor) => {
        e.preventDefault();
        console.log('applyMatch BUTTON입니다.', e.target);
        if (this.state.user !== null && e.target.name !== undefined) {
            const data = {
                idmatch: this.state.match[0].idmatch,
                uid: this.state.user.uid,
                depositor,
                match_has_user_fee: this.state.match[0].match_fee,
            }
    
            axios.post('http://localhost:3333/api/match/apply', {
                data,
            })
            .then((res) => {
                console.log(res.data);
                alert('신청 완료');
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    cancelApply = (e) => {
        e.preventDefault();
        const { user, match } = this.state;
        console.log(`cancelApply BUTTON 입니다.`, e.target);
        axios.post('http://localhost:3333/api/match/apply/cancel', {
            data: {
                uid: user.uid,
                idmatch: match[0].idmatch,
            }
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    cancelMatch = (e) => {
        e.preventDefault();
        const { match, applicants } = this.state;
        console.log(`cancelMatch BUTTON 입니다.`, e.target);
        axios.post('http://localhost:3333/api/match/cancel', {
            data: {
                idmatch: match[0].idmatch,
                applicants,
            }
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

    drawMap = (lat, lon) => {
        const { match } = this.state;
        const container = document.getElementById('map');
        daum.maps.load(() => {
            const options = {
                center: new daum.maps.LatLng(lon, lat),
                level: 3
            };
    
            const map = new daum.maps.Map(container, options);
        });
    }

    render() {
        const { match, applicants } = this.state;
        console.log('applicants:', this.state.applicants);
        return (
                <Layout user={this.state.user}>
                    <style jsx>{`

                    `}</style>
                    <div className="post-container">
                        {
                            match.length > 0 &&
                            <div className="post">
                                {/* <div className="notice-box">
                                    <p className="notice">{match[0].apply_status}, {match[0].total_guest}명 남음</p>
                                </div> */}
                                <div id="map" style={{width: "500px", height: "400px"}}></div>
                                <div id="intro">
                                    <p>{match[0].display_name} {(this.state.didIApply && (this.state.myApplicationInfo[0].applicant_status === '수락' && this.state.didICompletedPayment)) && match[0].phone}</p>
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
                                        {/* <span
                                            id="copy"
                                            onClick={this.copy}
                                        >
                                        주소 복사</span> */}
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
                                        <p>- 신청자 당일 경기 취소시 환불은 불가합니다.</p>
                                        <p>- 호스트의 경기 취소 또는 신청자 거절시 결제 금액은 100% 환불합니다.</p>
                                        <p>- 입금 확인 후 프로필에 등록하신 연락처로 경기 안내가 발송됩니다.</p>
                                        <p>- 입금 확인 후 경기 주최자의 연락처가 공개됩니다.</p>
                                    </div>
                                </div>
                                {
                                    this.state.user !== null &&
                                    (
                                        match[0].fb_uid == this.state.user.uid &&
                                        <div className="post-box">
                                            <h3>신청 상태</h3>
                                            <p>신청 상태는 호스트만 볼 수 있습니다. 호스트가 신청자(결제 완료) 수락을 해야 참여 확정됩니다. 반드시 수락/거절 여부를 선택해주세요.</p>
                                            <p>수락 시 해당 신청자 연락처를 볼 수 있습니다.</p>
                                            {
                                                (applicants.length > 0 && applicants.filter(applicant => {console.log(applicant); return applicant.applicant_status !== '신청취소' }).length > 0)
                                                ? <table className="applicants">
                                                    <thead>
                                                        <tr>
                                                            <th>신청자</th>
                                                            <th>신청 일시</th>
                                                            <th>입금 상태</th>
                                                            {/* {applicants.filter(applicant => applicant.applicant_status === '결제완료').length > 0 && <th></th>} */}
                                                            <th>신청 상태</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        applicants.map((applicant, i) => {
                                                            if (applicant.applicant_status !== '신청취소')
                                                            return (
                                                                <tr
                                                                    key={i * 2}
                                                                >
                                                                    <td>{applicant.name}</td>
                                                                    <td>{applicant.apply_time.slice(0, 4)}년 {applicant.apply_time.slice(5, 7)}월 {applicant.apply_time.slice(8, 10)}일 {applicant.apply_time.slice(11, 16)}분</td>
                                                                    {/* <td>{applicant.applicant_status}</td> */}
                                                                    <td>{applicant.payment_status}</td>
                                                                    {
                                                                        // 결제완료, 수락
                                                                        (applicant.payment_status === '결제완료' && applicant.applicant_status === '수락') &&
                                                                        <td>
                                                                            <p>{applicant.applicant_status}</p>
                                                                            <p>{applicant.phone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1  $2  $3")}</p>
                                                                        </td>
                                                                    }
                                                                    {
                                                                        // 결제완료, 신청취소
                                                                        (applicant.payment_status === '결제완료' && applicant.applicant_status === '신청취소' && applicant.reason_for_cancel === '호스트(신청거절)') &&
                                                                        <td>{applicant.applicant_status} - {applicant.reason_for_cancel}</td>
                                                                    }
                                                                    {
                                                                        // 결제 완료, 승인대기중
                                                                        applicant.applicant_status === '승인대기중' &&
                                                                        <td className="response-box">
                                                                            <button
                                                                                className="allow"
                                                                                onClick={this.handleApplicant}
                                                                                name={applicant.user_iduser}
                                                                                value="수락"
                                                                                disabled={applicant.payment_status === '결제전' ? true : false}
                                                                            >
                                                                                수락
                                                                            </button>
                                                                            <button
                                                                                className="reject"
                                                                                onClick={this.handleApplicant}
                                                                                name={applicant.user_iduser}
                                                                                value="신청취소"
                                                                                disabled={applicant.payment_status === '결제전' ? true : false}
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
                                match[0].match_status !== '경기취소'
                                    ? match[0].fb_uid == this.state.user.uid
                                        ? <div className="button-box">
                                            {
                                                (this.state.completedPaymentForApplicants.length > 0 && this.state.acceptedApplicants.length > 0)
                                                ? <input
                                                    className="cancel-match"
                                                    onClick={this.cancelMatch}
                                                    name={match[0].idmatch}
                                                    type="submit"
                                                    value="경기 취소"
                                                />
                                                : <input
                                                    className="remove-match"
                                                    onClick={this.removeMatch}
                                                    name={match[0].idpost}
                                                    type="submit"
                                                    value="경기 삭제"
                                                />
                                            }
                                            <button
                                                className="edit"
                                            >
                                                <Link prefetch href={{ pathname: '/match/edit', query: { id: this.props.url.query.id }}}><a>수정하기</a></Link>
                                            </button>
                                        </div>
                                    : (
                                        !this.state.didIApply || this.state.myApplicationInfo[0].applicant_status === '신청취소'
                                        ? <div className="button-box">
                                            <input
                                                className="apply"
                                                onClick={this.handlePrompt}
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
                                : <p className="canceld-match">호스트에의해 취소된 경기입니다. 결제한 금액은 취소시점 이후 24시간 내에 100% 환불됩니다.</p>
                            }
                    </div>
                </Layout>
        );
    }
}

export default Match;

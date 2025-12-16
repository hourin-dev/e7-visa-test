/**
 * e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (최신 개정안 반영)
 * * 함수명을 HTML의 onclick 이벤트와 일치하도록 'calculateScore'로 변경했습니다.
 */
function calculateScore() {
    // ==========================================================
    // 1. 입력 값 파싱 (HTML ID 기반)
    // ==========================================================
    const income = parseInt(document.getElementById('income').value) || 0;
    const koreanLevel = parseInt(document.getElementById('korean_level').value) || 0;
    const age = parseInt(document.getElementById('age').value) || 0;
    
    // 가점 체크박스
    const recCentral = document.getElementById('rec_central').checked;
    const recLocal = document.getElementById('rec_local').checked;
    const recCorp = document.getElementById('rec_corp').checked;
    const longService = document.getElementById('long_service').checked;
    const localAreaWork = document.getElementById('local_area_work').checked;
    const techDegree = document.getElementById('tech_degree').checked;
    const drivingLicense = document.getElementById('driving_license').checked;

    // 감점 입력
    const fineCount = parseInt(document.getElementById('fine_count').value) || 0;
    const taxArrearCount = parseInt(document.getElementById('tax_arrear_count').value) || 0;
    const violationCount = parseInt(document.getElementById('violation_count').value) || 0;
    const majorPenalty = document.getElementById('major_penalty').checked;
    
    // index.html에는 'e74Result' ID가 없으므로, 'results' div 내부의 'score_details'를 사용하거나,
    // HTML에 e74Result ID를 추가해야 합니다. 여기서는 HTML에 맞춰 결과 출력을 HTML의 ID에 직접 접근하도록 수정하겠습니다.
    const resultBox = document.getElementById('score_details'); // 결과 출력을 위한 DOM ID를 'score_details'로 가정 (HTML에 기반)
    
    let incomeScore = 0;
    let koreanScore = 0;
    let ageScore = 0;
    let bonusScore = 0;
    let penaltyScore = 0;
    let totalScore = 0;
    
    const REQUIRED_MIN_SCORE = 200;
    const REQUIRED_MIN_POINT = 50; // 소득 및 한국어 필수 최소 점수

    // ==========================================================
    // 2. 기본 항목 점수 계산 (최대 300점)
    // ==========================================================
    
    // 2-1. 소득 점수 (최대 120점)
    if (income >= 50000000) incomeScore = 120;
    else if (income >= 45000000) incomeScore = 110;
    else if (income >= 40000000) incomeScore = 95;
    else if (income >= 35000000) incomeScore = 80;
    else if (income >= 30000000) incomeScore = 65;
    else if (income >= 25000000) incomeScore = 50;

    // 2-2. 한국어 점수 (최대 120점)
    if (koreanLevel >= 4) koreanScore = 120;
    else if (koreanLevel === 3) koreanScore = 80;
    else if (koreanLevel === 2) koreanScore = 50;
    
    // 2-3. 나이 점수 (최대 60점)
    if (age >= 27 && age <= 33) ageScore = 60;
    else if (age >= 19 && age <= 26) ageScore = 40;
    else if (age >= 34 && age <= 40) ageScore = 30;
    else if (age >= 41) ageScore = 10;
    
    // ==========================================================
    // 3. 가점 항목 점수 계산
    // ==========================================================
    
    // 추천 (중앙부처/지자체 중 최대 30점)
    let recMax = 0;
    if (recCentral || recLocal) {
        recMax = 30;
    }
    bonusScore += recMax;
    
    // 기업체 추천
    bonusScore += recCorp ? 50 : 0;
    
    // 기타 가점
    bonusScore += longService ? 20 : 0;
    bonusScore += localAreaWork ? 20 : 0;
    bonusScore += techDegree ? 20 : 0;
    bonusScore += drivingLicense ? 10 : 0;
    
    // ==========================================================
    // 4. 감점 항목 점수 계산
    // ==========================================================
    
    // 4-1. 벌금형 (100만원 미만)
    if (fineCount === 1) penaltyScore += 5;
    else if (fineCount === 2) penaltyScore += 10;
    else if (fineCount >= 3) penaltyScore += 20;

    // 4-2. 조세 체납 (체류 허가 제한 사실)
    if (taxArrearCount === 1) penaltyScore += 5;
    else if (taxArrearCount === 2) penaltyScore += 10;
    else if (taxArrearCount >= 3) penaltyScore += 15;
    
    // 4-3. 출입국관리법 위반 (3회 이하)
    if (violationCount === 1) penaltyScore += 5;
    else if (violationCount === 2) penaltyScore += 10;
    else if (violationCount >= 3) penaltyScore += 15;
    
    // 4-4. 중대 제외 사유 (벌금 100만원 이상, 4회 이상 위반 등)
    let majorFailure = false;
    if (majorPenalty || violationCount > 3) {
         penaltyScore += 50; // 불허 사유는 50점으로 간주하여 최종 진단에 사용
         majorFailure = true;
    }

    // 5. 최종 계산
    totalScore = incomeScore + koreanScore + ageScore + bonusScore - penaltyScore;
    
    // 6. 필수 요건 확인
    const isIncomeMinMet = incomeScore >= REQUIRED_MIN_POINT;
    const isKoreanMinMet = koreanScore >= REQUIRED_MIN_POINT;
    const isTotalScoreMet = totalScore >= REQUIRED_MIN_SCORE;
    const isEligible = isIncomeMinMet && isKoreanMinMet && isTotalScoreMet && !majorFailure;

    // 7. 최종 진단 출력 (HTML 구조에 맞춰 결과 출력 로직 재정의)
    
    // 7-1. 상세 점수 테이블 생성
    const detailsHtml = `
        <table class="detail-table">
            <tr><th>구분</th><th>점수</th><th>최소 필수</th><th>충족</th></tr>
            <tr>
                <td>소득 (${(income / 10000).toLocaleString()}만원)</td>
                <td>${incomeScore}점</td>
                <td>50점</td>
                <td class="${isIncomeMinMet ? 'status-ok' : 'status-fail'}">${isIncomeMinMet ? '✅ 충족' : '❌ 미달'}</td>
            </tr>
            <tr>
                <td>한국어 (${koreanLevel}단계)</td>
                <td>${koreanScore}점</td>
                <td>50점</td>
                <td class="${isKoreanMinMet ? 'status-ok' : 'status-fail'}">${isKoreanMinMet ? '✅ 충족' : '❌ 미달'}</td>
            </tr>
            <tr>
                <td>나이 (${age}세)</td>
                <td>${ageScore}점</td>
                <td>-</td>
                <td>-</td>
            </tr>
            <tr>
                <td>**가점 총점**</td>
                <td>**+${bonusScore}점**</td>
                <td>-</td>
                <td>-</td>
            </tr>
            <tr>
                <td>**감점 총점**</td>
                <td style="color: red;">**-${penaltyScore}점**</td>
                <td>-</td>
                <td>-</td>
            </tr>
        </table>
    `;
    document.getElementById('score_details').innerHTML = detailsHtml;

    // 7-2. 최종 진단 상태 출력
    const eligibilityDiv = document.getElementById('eligibility_status');
    eligibilityDiv.classList.remove('eligible', 'not-eligible');
    
    let diagnosisStatus = '';

    if (majorFailure) {
        diagnosisStatus = "🚨 불허 사유 해당: 벌금 100만원 이상 또는 출입국 관리법 4회 이상 위반 등으로 전환 불가";
        eligibilityDiv.classList.add('not-eligible');
    } else if (isEligible) {
        diagnosisStatus = "🎉 축하합니다! 모든 필수 요건을 충족하여 전환 가능성이 높습니다. (총점 200점 이상)";
        eligibilityDiv.classList.add('eligible');
    } else {
        let reason = "⚠️ 요건 미충족";
        if (!isTotalScoreMet) reason += " (총점 200점 미달)";
        if (!isIncomeMinMet) reason += " (소득 최소 50점 미달)";
        if (!isKoreanMinMet) reason += " (한국어 최소 50점 미달)";
        
        diagnosisStatus = reason;
        eligibilityDiv.classList.add('not-eligible');
    }

    // 7-3. 최종 점수 및 진단 텍스트 업데이트
    document.getElementById('final_score_value').innerText = totalScore;
    eligibilityDiv.innerText = diagnosisStatus;
    
    // 7-4. 결과 영역 보이기
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
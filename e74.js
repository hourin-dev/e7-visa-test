/**
 * e74.js: E-7-4 숙련기능인력 점수 계산 및 진단 로직 (최신 개정안 반영)
 * * 주의: 이 함수는 이전에 최종 합의된 HTML의 ID (income, korean_level 등)를 사용합니다.
 * 만약 HTML 파일의 ID가 질문의 예시 ID(e74_income 등)와 다르다면 HTML 파일을 확인하십시오.
 */
function calculateE74() {
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
    
    const resultBox = document.getElementById('e74Result'); // 결과 출력 ID는 'e74Result'로 유지
    
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

    // 7. 최종 진단 출력
    let diagnosisStatus = '';
    let resultColor = 'red';
    let requiredMessage = '';

    if (majorFailure) {
        diagnosisStatus = '⛔ 불허 (중대 결격 사유 해당)';
        resultColor = 'red';
        requiredMessage = '🚨 벌금 100만원 이상 또는 출입국 관리법 4회 이상 위반 등으로 전환이 불가합니다.';
    } else if (!isIncomeMinMet || !isKoreanMinMet) {
        diagnosisStatus = '⛔ 불허 (필수 기본 요건 미충족)';
        resultColor = 'red';
        if (!isIncomeMinMet) requiredMessage += '소득 점수(최소 50점) 미달. ';
        if (!isKoreanMinMet) requiredMessage += '한국어 점수(최소 50점) 미달.';
    } else if (isEligible) {
        diagnosisStatus = '✅ 적격 (PASS) - 합격 가능성이 높습니다.';
        resultColor = 'green';
    } else {
        diagnosisStatus = '⚠️ 부적격 (총점 미달)';
        resultColor = 'orange';
        requiredMessage = `총점(${totalScore}점)이 합격 기준(${REQUIRED_MIN_SCORE}점)에 미달합니다.`;
    }
    
    resultBox.innerHTML = `
        <h3>✨ E-7-4 최종 진단 결과</h3>
        <p><strong>총 점수:</strong> <span style="font-size: 1.5em; font-weight: 900; color: ${resultColor};">${totalScore}점</span> (기준 ${REQUIRED_MIN_SCORE}점)</p>
        <p><strong>최종 진단:</strong> <span style="font-weight: bold; color: ${resultColor};">${diagnosisStatus}</span></p>
        ${requiredMessage ? `<p style="color:red; font-weight:bold;">필수 요건 미충족 사유: ${requiredMessage}</p>` : ''}
        <hr>
        <h4>[항목별 상세 배정 점수]</h4>
        <ul style="list-style-type: none; padding-left: 0;">
             <li style="font-weight: bold; margin-bottom: 5px;">기본 점수 (Max 300점)</li>
             <li>- ① 평균 소득: <strong>${incomeScore}점</strong> (최소 50점)</li>
             <li>- ② 한국어 능력: <strong>${koreanScore}점</strong> (최소 50점)</li>
             <li>- ③ 나이: <strong>${ageScore}점</strong></li>
             <li style="font-weight: bold; margin-top: 10px;">가점/감점</li>
             <li>- 가점 합계: <strong style="color: green;">+${bonusScore}점</strong></li>
             <li>- 감점 합계: <strong style="color: red;">-${penaltyScore}점</strong></li>
        </ul>
    `;
    
    // (선택 사항: e74Result 외에 다른 HTML 영역에 결과를 업데이트하려면 이 부분을 추가해야 함)
    // 예: document.getElementById('eligibility_status').innerText = diagnosisStatus;
}

// ⚠️ E-7-4 점수 계산 함수명이 'calculateE74'로 변경되었으므로,
// HTML 파일의 버튼 onclick 이벤트도 'calculateE74()'로 수정되어야 합니다. 
// (이전 HTML 파일은 'calculateScore()'였음)

//
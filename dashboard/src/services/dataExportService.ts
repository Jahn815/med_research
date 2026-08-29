import type { FirestoreSurveyDoc } from '../firebase';
import { QUESTION_DEFINITIONS } from './questionDefinitions';
import { getSBISRangeInfo, getFactor1RangeInfo, getFactor2RangeInfo, getFactor3RangeInfo } from './scoreCalculators';

/**
 * Escapes a string field for CSV format, handling quotes, commas, and line breaks.
 */
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Escapes a string literal for SQL INSERT statements.
 */
function escapeSqlString(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val).replace(/'/g, "''").replace(/\\/g, '\\\\');
  return `'${str}'`;
}

/**
 * Helper to download text file content in browser with proper UTF-8 BOM
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;') {
  // Use UTF-8 BOM (\uFEFF) for CSV so Excel opens Korean characters cleanly
  const bom = mimeType.includes('csv') ? '\uFEFF' : '';
  const blob = new Blob([bom + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. GENERATE WIDE MATRIX CSV
 * Returns a single flat matrix containing 1 row per participant.
 * Columns include Demographics, Clinical Scores & Levels, and Q1..Q40 (Values & Text Labels).
 */
export function generateWideMatrixCsv(docs: FirestoreSurveyDoc[]): string {
  const headers: string[] = [
    'Participant_ID',
    'Submitted_At_ISO',
    'Submitted_At_Local',
    'Locale',
    'Platform',
    'Consent_Agreed',

    // Demographics (Section 1)
    'Q2_Diagnosed_SLP_Value',
    'Q2_Diagnosed_SLP_Label',
    'Q3_Gender_Value',
    'Q3_Gender_Label',
    'Q4_Child_DOB',
    'Q5_Stuttering_Onset_Age',
    'Q6_Family_History_Value',
    'Q6_Family_History_Label',
    'Q7_Current_Therapy_Value',
    'Q7_Current_Therapy_Label',
    'Q8_Therapy_Duration',
    'Q9_Respondent_Relationship_Value',
    'Q9_Respondent_Relationship_Label',
    'Q20_Recipient_Emails',

    // Clinical Scores & Risk Levels
    'SBIS_Total_Score',
    'SBIS_Range_Label',
    'Factor1_Child_Response_Avg',
    'Factor1_Range_Label',
    'Factor2_Parent_Concern_Avg',
    'Factor2_Range_Label',
    'Factor3_Parent_Knowledge_Avg',
    'Factor3_Range_Label',
  ];

  // Dynamically add Q17..Q40 columns for individual responses
  const qKeys = Object.keys(QUESTION_DEFINITIONS).map(Number).sort((a, b) => {
    return QUESTION_DEFINITIONS[a].qNum - QUESTION_DEFINITIONS[b].qNum;
  });

  qKeys.forEach((qId) => {
    const qDef = QUESTION_DEFINITIONS[qId];
    headers.push(`Q${qDef.qNum}_Val_${qDef.sectionTitle.replace(/\s+/g, '_')}`);
    headers.push(`Q${qDef.qNum}_Label_${qDef.sectionTitle.replace(/\s+/g, '_')}`);
  });

  const rows: string[][] = [headers];

  docs.forEach((doc) => {
    const answers = doc.answers || {};
    const sbisVal = doc.scores?.sbisTotalScore ?? doc.scores?.sbis?.totalScore ?? 0;
    const f1Val = doc.scores?.factor1?.score ?? doc.scores?.pprsImpactAvg ?? 0;
    const f2Val = doc.scores?.factor2?.score ?? doc.scores?.pprsConcernAvg ?? 0;
    const f3Val = doc.scores?.factor3?.score ?? doc.scores?.pprsKnowledgeAvg ?? 0;

    const sbisRange = getSBISRangeInfo(sbisVal);
    const f1Range = getFactor1RangeInfo(f1Val);
    const f2Range = getFactor2RangeInfo(f2Val);
    const f3Range = getFactor3RangeInfo(f3Val);

    // Q2..Q9 demographic parsing
    const q2Val = answers[712970807];
    const q3Val = answers[1752391037];
    const q4Val = answers[1134267425] || '';
    const q5Val = answers[1439247192] || '';
    const q6Val = answers[1787834789];
    const q7Val = answers[783262104];
    const q8Val = answers[903264105] || '';
    const q9Val = answers[1204859102];
    const q20Email = answers[1043373996] || '';

    const row: string[] = [
      doc.id,
      doc.submittedAtIso || '',
      doc.submittedAtIso ? new Date(doc.submittedAtIso).toLocaleString('ko-KR') : '',
      doc.locale || 'ko',
      doc.metadata?.platform || 'Mobile',
      doc.scores?.consentAgreed !== false ? '1 (동의함)' : '0 (미동의)',

      // Q2
      q2Val !== undefined ? String(q2Val) : '',
      q2Val === 0 ? '예' : q2Val === 1 ? '아니오' : '',

      // Q3
      q3Val !== undefined ? String(q3Val) : '',
      q3Val === 0 ? '남아' : q3Val === 1 ? '여아' : '',

      // Q4 & Q5
      String(q4Val),
      String(q5Val),

      // Q6
      q6Val !== undefined ? String(q6Val) : '',
      q6Val === 0 ? '예' : q6Val === 1 ? '아니오' : '',

      // Q7
      q7Val !== undefined ? String(q7Val) : '',
      q7Val === 0 ? '예' : q7Val === 1 ? '아니오' : '',

      // Q8
      String(q8Val),

      // Q9
      q9Val !== undefined ? String(q9Val) : '',
      q9Val === 0 ? '어머니' : q9Val === 1 ? '아버지' : q9Val === 2 ? '기타' : '',

      // Q20
      String(q20Email),

      // Scores
      String(sbisVal),
      sbisRange.rangeLabel,
      Number(f1Val).toFixed(2),
      f1Range.rangeLabel,
      Number(f2Val).toFixed(2),
      f2Range.rangeLabel,
      Number(f3Val).toFixed(2),
      f3Range.rangeLabel,
    ];

    // Append Q17..Q40 answers
    qKeys.forEach((qId) => {
      const qDef = QUESTION_DEFINITIONS[qId];
      const rawAns = answers[qId];
      let valStr = rawAns !== undefined && rawAns !== null ? String(rawAns) : '';
      let labelStr = valStr;

      if (qDef.options && typeof rawAns === 'number') {
        const matched = qDef.options.find((o) => o.value === rawAns);
        if (matched) {
          labelStr = matched.label;
        }
      }

      row.push(valStr);
      row.push(labelStr);
    });

    rows.push(row);
  });

  return rows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
}

/**
 * 2. GENERATE RELATIONAL SQL SCRIPT (.sql)
 * Creates normalized SQL relational tables:
 * - Table: `participants`
 * - Table: `demographics`
 * - Table: `clinical_scores`
 * - Table: `question_responses`
 * - Table: `questions_dictionary`
 */
export function generateRelationalSqlDump(docs: FirestoreSurveyDoc[]): string {
  let sql = `-- ==========================================================\n`;
  sql += `-- MALDEODEUM RESEARCH SURVEY RELATIONAL SQL DATABASE EXPORT\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Compatible with PostgreSQL, MySQL, SQLite, DuckDB, MariaDB\n`;
  sql += `-- ==========================================================\n\n`;

  // DDL: Table 1 - participants
  sql += `CREATE TABLE IF NOT EXISTS participants (\n`;
  sql += `    participant_id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `    submitted_at_iso VARCHAR(64),\n`;
  sql += `    locale VARCHAR(10),\n`;
  sql += `    platform VARCHAR(64),\n`;
  sql += `    consent_agreed BOOLEAN\n`;
  sql += `);\n\n`;

  // DDL: Table 2 - demographics
  sql += `CREATE TABLE IF NOT EXISTS demographics (\n`;
  sql += `    participant_id VARCHAR(64) PRIMARY KEY REFERENCES participants(participant_id),\n`;
  sql += `    diagnosed_by_slp VARCHAR(16),\n`;
  sql += `    gender VARCHAR(16),\n`;
  sql += `    child_dob VARCHAR(32),\n`;
  sql += `    stuttering_onset_age VARCHAR(32),\n`;
  sql += `    family_history VARCHAR(16),\n`;
  sql += `    current_therapy VARCHAR(16),\n`;
  sql += `    therapy_duration VARCHAR(64),\n`;
  sql += `    respondent_relationship VARCHAR(32),\n`;
  sql += `    recipient_emails TEXT\n`;
  sql += `);\n\n`;

  // DDL: Table 3 - clinical_scores
  sql += `CREATE TABLE IF NOT EXISTS clinical_scores (\n`;
  sql += `    participant_id VARCHAR(64) PRIMARY KEY REFERENCES participants(participant_id),\n`;
  sql += `    sbis_total_score INT,\n`;
  sql += `    sbis_level_label VARCHAR(64),\n`;
  sql += `    factor1_child_response_score NUMERIC(5,2),\n`;
  sql += `    factor1_level_label VARCHAR(64),\n`;
  sql += `    factor2_parent_concern_score NUMERIC(5,2),\n`;
  sql += `    factor2_level_label VARCHAR(64),\n`;
  sql += `    factor3_parent_knowledge_score NUMERIC(5,2),\n`;
  sql += `    factor3_level_label VARCHAR(64)\n`;
  sql += `);\n\n`;

  // DDL: Table 4 - question_responses
  sql += `CREATE TABLE IF NOT EXISTS question_responses (\n`;
  sql += `    response_id SERIAL PRIMARY KEY,\n`;
  sql += `    participant_id VARCHAR(64) REFERENCES participants(participant_id),\n`;
  sql += `    question_id BIGINT,\n`;
  sql += `    question_num INT,\n`;
  sql += `    section_title VARCHAR(128),\n`;
  sql += `    question_text TEXT,\n`;
  sql += `    raw_numeric_value INT,\n`;
  sql += `    response_label TEXT\n`;
  sql += `);\n\n`;

  // DDL: Table 5 - questions_dictionary
  sql += `CREATE TABLE IF NOT EXISTS questions_dictionary (\n`;
  sql += `    question_id BIGINT PRIMARY KEY,\n`;
  sql += `    question_num INT,\n`;
  sql += `    section_title VARCHAR(128),\n`;
  sql += `    question_text TEXT\n`;
  sql += `);\n\n`;

  // DML: Insert Codebook
  sql += `-- Insert Question Dictionary Codebook\n`;
  Object.values(QUESTION_DEFINITIONS).forEach((qDef) => {
    sql += `INSERT INTO questions_dictionary (question_id, question_num, section_title, question_text) VALUES (\n`;
    sql += `    ${qDef.id}, ${qDef.qNum}, ${escapeSqlString(qDef.sectionTitle)}, ${escapeSqlString(qDef.text)}\n`;
    sql += `) ON CONFLICT DO NOTHING;\n`;
  });
  sql += `\n`;

  // DML: Insert Participant & Score Data
  docs.forEach((doc) => {
    const answers = doc.answers || {};
    const sbisVal = doc.scores?.sbisTotalScore ?? doc.scores?.sbis?.totalScore ?? 0;
    const f1Val = doc.scores?.factor1?.score ?? doc.scores?.pprsImpactAvg ?? 0;
    const f2Val = doc.scores?.factor2?.score ?? doc.scores?.pprsConcernAvg ?? 0;
    const f3Val = doc.scores?.factor3?.score ?? doc.scores?.pprsKnowledgeAvg ?? 0;

    const sbisRange = getSBISRangeInfo(sbisVal);
    const f1Range = getFactor1RangeInfo(f1Val);
    const f2Range = getFactor2RangeInfo(f2Val);
    const f3Range = getFactor3RangeInfo(f3Val);

    // Q2..Q9
    const q2Val = answers[712970807] === 0 ? '예' : answers[712970807] === 1 ? '아니오' : null;
    const q3Val = answers[1752391037] === 0 ? '남아' : answers[1752391037] === 1 ? '여아' : null;
    const q4Val = answers[1134267425] || null;
    const q5Val = answers[1439247192] || null;
    const q6Val = answers[1787834789] === 0 ? '예' : answers[1787834789] === 1 ? '아니오' : null;
    const q7Val = answers[783262104] === 0 ? '예' : answers[783262104] === 1 ? '아니오' : null;
    const q8Val = answers[903264105] || null;
    const q9Val = answers[1204859102] === 0 ? '어머니' : answers[1204859102] === 1 ? '아버지' : answers[1204859102] === 2 ? '기타' : null;
    const q20Email = answers[1043373996] || null;

    // 1. Insert into participants
    sql += `INSERT INTO participants (participant_id, submitted_at_iso, locale, platform, consent_agreed) VALUES (\n`;
    sql += `    ${escapeSqlString(doc.id)}, ${escapeSqlString(doc.submittedAtIso)}, ${escapeSqlString(doc.locale || 'ko')}, ${escapeSqlString(doc.metadata?.platform || 'Mobile')}, ${doc.scores?.consentAgreed !== false ? 'TRUE' : 'FALSE'}\n`;
    sql += `);\n`;

    // 2. Insert into demographics
    sql += `INSERT INTO demographics (participant_id, diagnosed_by_slp, gender, child_dob, stuttering_onset_age, family_history, current_therapy, therapy_duration, respondent_relationship, recipient_emails) VALUES (\n`;
    sql += `    ${escapeSqlString(doc.id)}, ${escapeSqlString(q2Val)}, ${escapeSqlString(q3Val)}, ${escapeSqlString(q4Val)}, ${escapeSqlString(q5Val)}, ${escapeSqlString(q6Val)}, ${escapeSqlString(q7Val)}, ${escapeSqlString(q8Val)}, ${escapeSqlString(q9Val)}, ${escapeSqlString(q20Email)}\n`;
    sql += `);\n`;

    // 3. Insert into clinical_scores
    sql += `INSERT INTO clinical_scores (participant_id, sbis_total_score, sbis_level_label, factor1_child_response_score, factor1_level_label, factor2_parent_concern_score, factor2_level_label, factor3_parent_knowledge_score, factor3_level_label) VALUES (\n`;
    sql += `    ${escapeSqlString(doc.id)}, ${sbisVal}, ${escapeSqlString(sbisRange.rangeLabel)}, ${Number(f1Val).toFixed(2)}, ${escapeSqlString(f1Range.rangeLabel)}, ${Number(f2Val).toFixed(2)}, ${escapeSqlString(f2Range.rangeLabel)}, ${Number(f3Val).toFixed(2)}, ${escapeSqlString(f3Range.rangeLabel)}\n`;
    sql += `);\n`;

    // 4. Insert into question_responses
    Object.entries(answers).forEach(([qIdStr, rawAns]) => {
      const qId = Number(qIdStr);
      const qDef = QUESTION_DEFINITIONS[qId];
      if (!qDef) return;

      let valNum = typeof rawAns === 'number' ? rawAns : null;
      let labelStr = String(rawAns);

      if (qDef.options && typeof rawAns === 'number') {
        const matched = qDef.options.find((o) => o.value === rawAns);
        if (matched) {
          labelStr = matched.label;
        }
      }

      sql += `INSERT INTO question_responses (participant_id, question_id, question_num, section_title, question_text, raw_numeric_value, response_label) VALUES (\n`;
      sql += `    ${escapeSqlString(doc.id)}, ${qDef.id}, ${qDef.qNum}, ${escapeSqlString(qDef.sectionTitle)}, ${escapeSqlString(qDef.text)}, ${valNum !== null ? valNum : 'NULL'}, ${escapeSqlString(labelStr)}\n`;
      sql += `);\n`;
    });

    sql += `\n`;
  });

  return sql;
}

/**
 * 3. GENERATE RELATIONAL CSV TABLES BUNDLE
 * Exports 4 relational CSV tables in a single clear document format:
 * - Table 1: Participants & Demographics
 * - Table 2: Clinical Scores
 * - Table 3: Question Responses Detail
 * - Table 4: Question Definitions Codebook
 */
export function generateRelationalCsvTablesBundle(docs: FirestoreSurveyDoc[]): {
  participantsCsv: string;
  scoresCsv: string;
  responsesCsv: string;
  codebookCsv: string;
} {
  // Table 1: Participants & Demographics
  const partHeaders = [
    'Participant_ID',
    'Submitted_At_ISO',
    'Locale',
    'Platform',
    'Consent_Agreed',
    'Diagnosed_SLP',
    'Gender',
    'Child_DOB',
    'Stuttering_Onset_Age',
    'Family_History',
    'Current_Therapy',
    'Therapy_Duration',
    'Respondent_Relationship',
    'Recipient_Emails',
  ];
  const partRows: string[][] = [partHeaders];

  // Table 2: Scores
  const scoreHeaders = [
    'Participant_ID',
    'SBIS_Total_Score',
    'SBIS_Range_Label',
    'Factor1_Child_Response_Avg',
    'Factor1_Range_Label',
    'Factor2_Parent_Concern_Avg',
    'Factor2_Range_Label',
    'Factor3_Parent_Knowledge_Avg',
    'Factor3_Range_Label',
  ];
  const scoreRows: string[][] = [scoreHeaders];

  // Table 3: Responses Detail
  const respHeaders = [
    'Participant_ID',
    'Question_ID',
    'Question_Num',
    'Section_Title',
    'Question_Text',
    'Numeric_Value',
    'Response_Label',
  ];
  const respRows: string[][] = [respHeaders];

  // Table 4: Codebook
  const codebookHeaders = ['Question_ID', 'Question_Num', 'Section_Title', 'Question_Text_KR'];
  const codebookRows: string[][] = [codebookHeaders];

  Object.entries(QUESTION_DEFINITIONS).forEach(([, qDef]) => {
    codebookRows.push([
      String(qDef.id),
      String(qDef.qNum),
      qDef.sectionTitle,
      qDef.text,
    ]);
  });

  docs.forEach((doc) => {
    const answers = doc.answers || {};
    const sbisVal = doc.scores?.sbisTotalScore ?? doc.scores?.sbis?.totalScore ?? 0;
    const f1Val = doc.scores?.factor1?.score ?? doc.scores?.pprsImpactAvg ?? 0;
    const f2Val = doc.scores?.factor2?.score ?? doc.scores?.pprsConcernAvg ?? 0;
    const f3Val = doc.scores?.factor3?.score ?? doc.scores?.pprsKnowledgeAvg ?? 0;

    const sbisRange = getSBISRangeInfo(sbisVal);
    const f1Range = getFactor1RangeInfo(f1Val);
    const f2Range = getFactor2RangeInfo(f2Val);
    const f3Range = getFactor3RangeInfo(f3Val);

    const q2Val = answers[712970807] === 0 ? '예' : answers[712970807] === 1 ? '아니오' : '';
    const q3Val = answers[1752391037] === 0 ? '남아' : answers[1752391037] === 1 ? '여아' : '';
    const q4Val = answers[1134267425] || '';
    const q5Val = answers[1439247192] || '';
    const q6Val = answers[1787834789] === 0 ? '예' : answers[1787834789] === 1 ? '아니오' : '';
    const q7Val = answers[783262104] === 0 ? '예' : answers[783262104] === 1 ? '아니오' : '';
    const q8Val = answers[903264105] || '';
    const q9Val = answers[1204859102] === 0 ? '어머니' : answers[1204859102] === 1 ? '아버지' : answers[1204859102] === 2 ? '기타' : '';
    const q20Email = answers[1043373996] || '';

    // Participant row
    partRows.push([
      doc.id,
      doc.submittedAtIso || '',
      doc.locale || 'ko',
      doc.metadata?.platform || 'Mobile',
      doc.scores?.consentAgreed !== false ? '1 (동의함)' : '0 (미동의)',
      q2Val,
      q3Val,
      String(q4Val),
      String(q5Val),
      q6Val,
      q7Val,
      String(q8Val),
      q9Val,
      String(q20Email),
    ]);

    // Score row
    scoreRows.push([
      doc.id,
      String(sbisVal),
      sbisRange.rangeLabel,
      Number(f1Val).toFixed(2),
      f1Range.rangeLabel,
      Number(f2Val).toFixed(2),
      f2Range.rangeLabel,
      Number(f3Val).toFixed(2),
      f3Range.rangeLabel,
    ]);

    // Responses rows
    Object.entries(answers).forEach(([qIdStr, rawAns]) => {
      const qId = Number(qIdStr);
      const qDef = QUESTION_DEFINITIONS[qId];
      if (!qDef) return;

      let valNum = typeof rawAns === 'number' ? String(rawAns) : '';
      let labelStr = String(rawAns);

      if (qDef.options && typeof rawAns === 'number') {
        const matched = qDef.options.find((o) => o.value === rawAns);
        if (matched) {
          labelStr = matched.label;
        }
      }

      respRows.push([
        doc.id,
        String(qDef.id),
        String(qDef.qNum),
        qDef.sectionTitle,
        qDef.text,
        valNum,
        labelStr,
      ]);
    });
  });

  return {
    participantsCsv: partRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
    scoresCsv: scoreRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
    responsesCsv: respRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
    codebookCsv: codebookRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
  };
}

import aishaImg from '../assets/images/candidate_aisha_bello_1788877983464.jpg';
import danielImg from '../assets/images/candidate_daniel_okafor_1788878005207.jpg';
import chinweImg from '../assets/images/candidate_chinwe_nwosu_1788878019726.jpg';
import ibrahimImg from '../assets/images/candidate_ibrahim_musa_1788878040197.jpg';
import fatimaImg from '../assets/images/candidate_fatima_aliyu_1788878145289.jpg';
import tundeImg from '../assets/images/candidate_samuel_adeleke_1788878164142.jpg';

export interface Candidate {
  id: string;
  name: string;
  party?: string;
  position: string;
  rank: number;
  description: string;
  votes: number;
  image: string;
  isLeader?: boolean;
  manifesto?: string[];
  education?: string;
  experience?: string;
}

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'aisha-bello',
    name: 'Aisha Bello',
    party: 'Better Tomorrow Movement',
    position: 'President',
    rank: 1,
    description: 'A strong voice for youth empowerment and sustainable development.',
    votes: 842,
    image: aishaImg,
    isLeader: true,
    manifesto: [
      'Empowering youth tech initiatives and vocational training programs',
      'Implementing 100% renewable energy projects across community centers',
      'Establishing transparent digital governance and public fund audits'
    ],
    education: 'M.Sc. Public Administration & Public Policy',
    experience: '8+ years community leadership & sustainable development advocate'
  },
  {
    id: 'daniel-okafor',
    name: 'Daniel Okafor',
    party: 'Unity First',
    position: 'Vice President',
    rank: 2,
    description: 'Focused on innovation, job creation and a better future for all.',
    votes: 623,
    image: danielImg,
    manifesto: [
      'Fostering local entrepreneurship micro-grant funds',
      'Upgrading digital community infrastructure and broadband',
      'Modernizing public health and safety protocols'
    ],
    education: 'B.Sc. Computer Engineering & MBA',
    experience: 'Tech startup founder and civic innovation advisor'
  },
  {
    id: 'chinwe-nwosu',
    name: 'Chinwe Nwosu',
    party: 'Progressive Youths',
    position: 'Secretary',
    rank: 3,
    description: 'Bringing transparency, accountability and people-centered leadership.',
    votes: 421,
    image: chinweImg,
    manifesto: [
      'Open meeting transcripts and real-time public resolutions',
      'Citizen feedback loop portal with 24-hour response pledge',
      'Streamlined digital archiving for all civic records'
    ],
    education: 'LL.B. Corporate & International Civic Law',
    experience: 'Legal consultant and community board secretary'
  },
  {
    id: 'ibrahim-musa',
    name: 'Ibrahim Musa',
    party: 'Future Leaders',
    position: 'Treasurer',
    rank: 4,
    description: 'Committed to smart financial management and sustainable growth.',
    votes: 318,
    image: ibrahimImg,
    manifesto: [
      'Transparent cryptographic audit reports published quarterly',
      'Zero-waste expenditure policy with community review boards',
      'Balanced budget allocation for public parks and library systems'
    ],
    education: 'Chartered Accountant (ACA) & B.Sc. Finance',
    experience: 'Senior financial analyst and civic treasury auditor'
  },
  {
    id: 'fatima-sani',
    name: 'Fatima Sani',
    party: 'The Change Agenda',
    position: 'Organizing Secretary',
    rank: 5,
    description: 'Championing inclusive social welfare, healthcare access, and student engagement.',
    votes: 219,
    image: fatimaImg,
    manifesto: [
      'Streamlined election event coordination and voter outreach',
      'Transparent townhall meetings across all campus chapters',
      'Community resource hubs and inclusive participation drives'
    ],
    education: 'Master of Public Administration (MPA)',
    experience: '6 years community organizing and civic logistics'
  },
  {
    id: 'tunde-alabi',
    name: 'Tunde Alabi',
    party: 'Reform Alliance',
    position: 'Welfare Officer',
    rank: 6,
    description: 'Dedicated to community welfare, mental wellness, and rapid crisis response.',
    votes: 176,
    image: tundeImg,
    manifesto: [
      'Subsidized emergency healthcare fund for community members',
      '24/7 mental wellness counseling hotline and support groups',
      'Accessible physical infrastructure for persons with disabilities'
    ],
    education: 'B.Sc. Sociology & Community Development',
    experience: 'Youth welfare coordinator and humanitarian aid lead'
  }
];

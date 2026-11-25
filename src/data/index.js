import midterm from './midterm.js';
import rm from './rm.js';
import ml from './ml.js';
import { midtermExplanations, midtermGuides } from './midtermExtras.js';

const expand = (rows) =>
  rows.map(([q, A, B, C, D, a]) => ({ q, o: { A, B, C, D }, a }));

const g = (title, intro, blocks) => ({ title, intro, blocks });

const rmGuides = [
  g('Research foundations, reasoning and paradigms', 'Study guide for Research Methodology questions 1–50.', [
    ['Core concepts', 'Research is a systematic inquiry that develops defensible knowledge or addresses a defined practical problem. Basic research advances general understanding; applied research addresses an operational need. Empirical work relies on observation or measurement, while theoretical work develops or proves concepts. Reasoning can be inductive (observations → general pattern), deductive (theory → testable implications), or abductive (best plausible explanation of surprising evidence).'],
    ['Key distinctions and exam reminders', 'Paradigms connect assumptions to methods: ontology asks what reality is; epistemology asks what counts as knowledge; axiology concerns values and ethics. Positivism emphasizes objective measurement; post-positivism accepts a real world but fallible knowledge; interpretivism studies meanings; social constructivism sees knowledge as socially constructed; pragmatism selects methods for their usefulness; critical realism distinguishes observable events from underlying mechanisms.'],
  ]),
  g('Research purposes, questions, variables and hypotheses', 'Study guide for Research Methodology questions 51–100.', [
    ['Core concepts', 'Descriptive research asks what exists or is happening; explanatory research asks why; exploratory research investigates a poorly understood area; evaluative research judges against explicit criteria. A good research question is answerable, focused and aligned with available evidence. Objectives state intended achievements; questions guide inquiry; hypotheses are testable proposed relationships or differences. The null hypothesis usually states no specified effect; the alternative states an effect. Directional hypotheses predict a direction; nondirectional hypotheses predict a difference without its sign.'],
    ['Key distinctions and exam reminders', 'A variable can vary across observations. Independent variables are predictors or manipulated factors; dependent variables are outcomes. Constructs are abstract concepts measured through indicators, so operational definitions must specify exactly how a construct is observed. Confounders relate to both predictor and outcome; mediators transmit an effect; moderators change its strength or direction.'],
  ]),
  g('Research gaps, novelty, scope and contribution', 'Study guide for Research Methodology questions 101–150.', [
    ['Core concepts', 'Common gap types include theoretical (theory cannot explain something), methodological (existing methods cannot answer the question), empirical (insufficient observed evidence), computational (resource constraints), dataset (missing populations/classes), artifact (no suitable tool), evaluation (unrealistic or incomplete testing), contextual (findings untested in another setting), and practical (unresolved stakeholder need). A gap must be demonstrated through literature rather than asserted.'],
    ['Key distinctions and exam reminders', 'Novelty is a meaningful distinction from existing knowledge or artifacts; significance explains why it matters. A contribution statement should say what is added and what evidence supports it. Define the population, context, phenomenon and outcome to make a topic researchable. Scope defines what is covered; delimitations are intentional boundaries; limitations are constraints that affect interpretation. Avoid universal claims from narrow samples.'],
  ]),
  g('Literature searching and scholarly sources', 'Study guide for Research Methodology questions 151–200.', [
    ['Core concepts', 'Use relevant scholarly databases and discovery tools. IEEE Xplore and the ACM Digital Library are important computing sources; Scopus supports broad indexed discovery and citation tracking; Google Scholar provides broad cross-source discovery but does not guarantee peer review. Search strategies combine keywords, synonyms and controlled vocabulary. AND narrows by requiring concepts together; OR broadens with synonyms; NOT excludes terms. Parentheses control grouping, quotation marks search phrases, wildcards cover word variants, and proximity operators find terms near one another.'],
    ['Key distinctions and exam reminders', 'Document exact databases, dates and search strings so the process can be repeated. Backward citation chaining examines a paper’s references; forward chaining finds newer works citing it. A seed paper is a highly relevant starting point. Combining database searching and citation chaining can retrieve complementary literature. Sensitivity is the ability to retrieve relevant studies; precision is the proportion of retrieved records that are relevant.'],
  ]),
  g('Reviewing, screening and managing literature', 'Study guide for Research Methodology questions 201–250.', [
    ['Core concepts', 'A literature review should synthesize and compare evidence, not merely list paper summaries. Define inclusion criteria (what makes a record eligible) and exclusion criteria (what disqualifies it) before screening. Distinguish a report from the underlying study because one study may produce multiple publications. Track duplicates, overlapping evidence and reasons for exclusion. Gray literature can add useful evidence but may have less consistent review and reporting.'],
    ['Key distinctions and exam reminders', 'Reference managers organize citations and bibliographies. Predatory publishing warning signs include deceptive claims, opaque editorial practices and aggressive solicitation. Open-access licenses specify permitted reuse. A review should assess the credibility and limitations of sources, not treat every retrieved item as equally reliable.'],
  ]),
  g('Evidence quality, bias and systematic reviews', 'Study guide for Research Methodology questions 251–300.', [
    ['Core concepts', 'Systematic reviews use explicit, reproducible methods to locate, select, appraise and synthesize studies. A protocol records planned methods; deviations should be transparently reported and justified. Selection bias arises when included participants or studies differ systematically; performance bias concerns differences in care or behavior beyond the intervention; detection bias concerns how outcomes are measured or judged.'],
    ['Key distinctions and exam reminders', 'Assess the risk of bias and the quality of underlying evidence before making strong conclusions. Sparse, inconsistent or low-quality evidence warrants cautious conclusions and clear uncertainty. A review’s unit of inclusion is generally the study, not simply each report. Umbrella reviews synthesize systematic reviews and must watch for overlapping primary studies.'],
  ]),
  g('Design science research and artifacts', 'Study guide for Research Methodology questions 301–350.', [
    ['Core concepts', 'Design science research creates and evaluates an artifact to address a relevant problem. Artifacts can include constructs (concepts/vocabulary), models (representations), methods (procedures) and instantiations (working systems). The research problem and stakeholder need should motivate the artifact; evaluation should demonstrate utility and be appropriate to the claim.'],
    ['Key distinctions and exam reminders', 'Compare an artifact with existing solutions or a defensible baseline. Design involves tradeoffs such as accuracy, usability, cost, privacy and computational demand. Traceability links requirements, design decisions, implementation and evaluation evidence. A useful artifact is not automatically a scientific contribution: explain what is learned and what can reasonably transfer beyond the specific build.'],
  ]),
  g('Research designs, experiments and validity', 'Study guide for Research Methodology questions 351–400.', [
    ['Core concepts', 'Surveys describe attitudes or characteristics; randomized controlled experiments assign treatments randomly; quasi-experiments evaluate interventions without full random assignment. The average treatment effect compares expected outcomes under treatment and control. Internal validity concerns whether the observed effect is attributable to the intervention; external validity concerns applicability beyond the study setting.'],
    ['Key distinctions and exam reminders', 'One-group pretest–posttest designs are vulnerable to history, maturation and testing effects. Repeated-measures designs analyze multiple observations from the same units. Multiple comparisons increase the chance of false-positive findings, so plan comparisons and correction strategies. Define outcomes and success criteria before analysis to reduce post hoc selection.'],
  ]),
  g('Sampling, splitting and data leakage', 'Study guide for Research Methodology questions 401–450.', [
    ['Core concepts', 'Probability sampling includes methods such as simple random, stratified, cluster and multistage sampling. Convenience sampling selects accessible cases and can limit representativeness. Stratification ensures important subgroups are represented. The target population is the group to which conclusions are intended to apply; the sample is the subset actually observed.'],
    ['Key distinctions and exam reminders', 'For machine-learning evaluation, keep train, validation and test roles distinct. Stratified splitting preserves class proportions when appropriate. Group-aware splitting prevents related records from the same person, organization or device leaking across partitions. Class imbalance can make accuracy misleading; report suitable class-sensitive metrics. Avoid data leakage by ensuring information unavailable at prediction time does not enter training or evaluation.'],
  ]),
  g('Measurement quality, validity and reliability', 'Study guide for Research Methodology questions 451–500.', [
    ['Core concepts', 'Reliability concerns consistency of measurement; validity concerns whether the instrument measures the intended construct. Content validity asks whether the relevant content domain is covered; construct validity concerns whether evidence supports the theoretical construct; convergent validity checks agreement with related measures; discriminant validity checks distinction from different constructs. Face validity is whether a measure appears appropriate, while ecological validity concerns realism in the intended context.'],
    ['Key distinctions and exam reminders', 'Operationalize constructs with clear indicators and document measurement procedures. Be cautious when generalizing from a narrow context. In qualitative work, transferability is supported by rich contextual description so readers can judge relevance elsewhere. Distinguish statistical generalizability from qualitative transferability and do not overstate what the design can support.'],
  ]),
];

const mlGuides = [
  g('Exploratory Data Analysis and data understanding', 'Study guide for Machine Learning questions 1–50.', [
    ['Exploratory Data Analysis and data understanding', 'EDA is performed before model training to understand a dataset, identify missing values, duplicates and unusual observations, and discover patterns. A dataset contains observations (rows) and variables (columns). CSV means Comma-Separated Values. Histograms show numerical distributions; bar charts compare categories; line charts show trends over time; scatter plots show relationships between two variables; box plots help identify spread and potential outliers. Mean, median and mode describe central tendency; standard deviation describes spread. Correlation measures association, not necessarily causation. Pandas is commonly used for data handling and Matplotlib for visualization.'],
    ['Decision Trees', 'A Decision Tree is a supervised machine-learning algorithm used for classification and regression. The root node is the first decision, branches represent decision rules, and leaf nodes give final predictions. ID3 is a tree-building algorithm; information gain helps select splits, while the Gini index measures class impurity. Trees are interpretable but can overfit when too deep; pruning helps reduce overfitting.'],
    ['Introduction to image detection', 'Image detection identifies objects or relevant content in images. Computer Vision is the AI field concerned with interpreting visual data. The first ten image-detection questions introduce image identification, computer vision, cameras and image preprocessing; image preprocessing improves image quality or consistency before analysis.'],
  ]),
  g('Decision Trees, computer vision and AI development', 'Study guide for Machine Learning questions 51–100.', [
    ['Computer Vision and image detection', 'Images are represented as pixels, the smallest image units. A Convolutional Neural Network (CNN) is a neural-network architecture commonly used for image tasks. Image classification predicts an image category; object detection identifies objects and their locations, often with bounding boxes. Face recognition is an image-analysis application. Training datasets provide examples from which AI models learn. Computer Vision is used in areas such as self-driving vehicles, healthcare and security.'],
    ['AI software development lifecycle', 'An AI project starts by defining the problem, then collecting and cleaning data, training a model, validating and testing it, deploying it, and monitoring feedback. Training means learning patterns from examples. Validation data supports model selection and improvement; a separate test set estimates performance on unseen data. Deployment means using the model in a real application. Monitoring and feedback help identify when updates are needed. Python is a common language, TensorFlow is an AI framework, and accuracy is one model-evaluation metric.'],
    ['Generative AI and responsible use', 'Generative AI creates new content such as text, images and code. A prompt is an instruction given to an AI system. It can assist with writing, coding, brainstorming, summarizing, translation, presentations, education, healthcare and business tasks. AI-generated content should be reviewed because it can contain incorrect information. Ethical use means acting fairly and responsibly rather than trusting outputs blindly.'],
  ]),
];

export const SUBJECTS = {
  midterm: {
    key: 'midterm', name: 'Midterm MCQs', short: 'MID', emoji: '📊',
    tagline: 'Bayes · K-means · Metrics · Statistics',
    hue: 'var(--c1)',
    questions: expand(midterm), guides: midtermGuides, explanations: midtermExplanations,
  },
  rm: {
    key: 'rm', name: 'Research Methodology', short: 'RM', emoji: '🔬',
    tagline: 'Paradigms · Reviews · Design · Validity',
    hue: 'var(--c2)',
    questions: expand(rm), guides: rmGuides, explanations: null,
  },
  ml: {
    key: 'ml', name: 'Machine Learning', short: 'ML', emoji: '🤖',
    tagline: 'EDA · Trees · Vision · GenAI',
    hue: 'var(--c3)',
    questions: expand(ml), guides: mlGuides, explanations: null,
  },
};

export const GROUP_SIZE = 50;

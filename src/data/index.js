import midterm from './midterm.js';
import rm from './rm.js';
import ml from './ml.js';
import dm from './dm.js';
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

const dmGuides = [
  g('KDD, data types, mining tasks and basic statistics', 'Study guide for Data Mining questions 1–50.', [
    ['Knowledge discovery (KDD)', 'Data mining, also called knowledge discovery in databases (KDD), extracts patterns that are valid, novel, potentially useful and understandable. The data mining step outputs patterns, which are then interpreted and evaluated to become knowledge. The market-basket example (pizza, beer, chips) is about finding items frequently bought together. The three "V" challenges are Volume, Variety and Velocity (a data stream versus static data is Velocity); Veracity is not one of the three.'],
    ['Types of data', 'Record data: rows are data objects, columns are attributes (characteristics of an object). Market baskets are transaction data. A document–term matrix stores how often each term occurs in a document. m objects with n numeric attributes form an m × n data matrix (each object is a point in n-D space). Temporal data covers time series and sequence data (e.g. Night sweat → Fever → Anemia). Interval relations: A(1–5) overlaps C(3–12); C(3–12) contains B(4–9). Trajectory data (hurricane paths, RFID) is sampled as <latitude, longitude, time>. Social networks are graph data, XML is semi-structured, reviews and tweets are unstructured.'],
    ['Mining tasks', 'Clustering finds natural groups in unlabeled data; classification learns to predict a class from pre-labeled instances (spam filtering). Association rules are descriptive; regression, prediction and time-series analysis are predictive. Confidence(X ⇒ Y) = support(X ∪ Y) / support(X): Milk ⇒ Bread = 4/6 ≈ 66%. Statistics is more theory-based and hypothesis-testing; data mining/KDD covers the whole process including cleaning and visualization. Summarization describes a group with natural language and graphics; motif discovery finds repeated patterns in a time series.', 'confidence(X⇒Y) = count(X∪Y) / count(X)'],
    ['Attribute types and central tendency', 'Nominal: categories without order (hair color). Asymmetric binary: outcomes of unequal importance (medical test positive/negative). Ordinal: ordered categories (small/medium/large). Interval: equal units, no true zero (Celsius). Ratio: true zero (Kelvin — 10 K is twice 5 K). Zip codes are discrete. Resolution means patterns depend on scale. With an even count, the median is the average of the two middle values. Moderately skewed data: mean − mode ≈ 3 × (mean − median). Positive skew: mode < median < mean.', 'mean − mode ≈ 3 × (mean − median)'],
    ['Dispersion and the normal curve', 'IQR = Q3 − Q1. The five-number summary is min, Q1, median, Q3, max. Outliers lie beyond 1.5 × IQR from the quartiles (Q1 = 20, Q3 = 40 → upper fence 40 + 30 = 70). Normal distribution: μ ± σ ≈ 68%, μ ± 2σ ≈ 95%, μ ± 3σ ≈ 99.7%. In a histogram the bar area denotes the value and bars are adjacent; histograms can reveal differences that identical boxplots hide.', 'upper fence = Q3 + 1.5 × IQR'],
  ]),
  g('Visualization, similarity, data quality, cleaning and integration', 'Study guide for Data Mining questions 51–100.', [
    ['Plots and visualization techniques', 'Quantile plot: f_i means about 100·f_i % of the data are ≤ x_i. Q-Q plot compares quantiles of two distributions to spot a shift. Scatter plots give a first look at bivariate data. Categories: pixel-oriented (circle segments save space and show dimension connections), geometric projection (scatterplot matrix, parallel coordinates — each item is a polyline crossing every axis), icon-based (Chernoff faces, stick figures with a body and four limbs), and hierarchical (dimensional stacking, hard beyond ~9 dimensions; tree-maps partition the screen alternately in x and y). Tag clouds show importance by font size or color.'],
    ['Similarity and distance', 'Similarity is higher for more alike objects; dissimilarity is lower. A dissimilarity matrix is single-mode and triangular. Nominal simple matching: d = (p − m) / p (5 variables, 2 matches → 0.6). Asymmetric binary Jaccard = q / (q + r + s) (2/4 = 0.5). Minkowski h = 1 is Manhattan, h = 2 Euclidean, h → ∞ supremum. For (1,2) and (4,6): Manhattan 7, Euclidean 5, supremum 4. Triangle inequality: d(i,j) ≤ d(i,k) + d(k,j). Hamming distance counts differing bits. Ordinal ranks map to (r − 1) / (M − 1). Cosine similarity = dot product / product of lengths.', 'd = (p − m)/p · Jaccard = q/(q+r+s) · z = (x − μ)/σ'],
    ['Data quality and cleaning', 'Quality measures: accuracy, completeness, consistency, timeliness, believability, interpretability (not scalability). Preprocessing tasks: cleaning, integration, reduction, transformation and discretization. Salary = "−10" is noisy data; "Jan. 1" as everyone\'s birthday is disguised missing data. Ignore a tuple when its class label is missing; filling with the class-wise mean is smarter than the global mean. Binning: bin 4, 8, 9, 15 → mean 9; by boundaries, 24 in (21, 21, 24, 25) → 25. Equal-width with range 4–34 and N = 3 gives width 10; outliers and skew hurt it. Data scrubbing uses simple domain knowledge (postal codes, spell-check).', 'width = (max − min) / N'],
    ['Integration and correlation', 'Schema integration matches A.cust-id with B.cust-#; entity identification recognizes Bill Clinton = William Clinton. Redundancy is found via correlation and covariance analysis. Chi-square: expected = row total × column total / grand total (450 × 300 / 1500 = 90); χ² = Σ (observed − expected)² / expected ≈ 507.93 for the sci-fi/chess table — larger means more likely related. Correlation does not imply causality. r < 0 means negative correlation; positive covariance means the values tend to rise together.', 'χ² = Σ (O − E)² / E'],
    ['Starting data reduction', 'Data reduction yields a much smaller representation with (almost) the same analytical results. The curse of dimensionality: as dimensions grow, data become sparse and distances less meaningful. PCA is a dimensionality reduction technique; the discrete wavelet transform applies a smoothing and a difference function to pairs of values.'],
  ]),
  g('Data reduction, transformation and discretization', 'Study guide for Data Mining questions 101–120.', [
    ['Reduction techniques', 'PCA projects onto the eigenvectors of the covariance matrix. Price and sales tax are redundant attributes. d attributes give 2^d possible subsets. Parametric numerosity reduction assumes a model and stores only its parameters (linear regression via least squares). Clustering helps when data are clustered, not smeared. Stratified sampling suits skewed data; with replacement (SRSWR) an object can be picked again. The lowest data-cube level is the base cuboid. String compression is typically lossless.'],
    ['Normalization', 'Normalization is a transformation method. Min-max: (73,000 − 12,000) / (98,000 − 12,000) ≈ 0.716. Z-score: (73,600 − 54,000) / 16,000 = 1.225. Decimal scaling divides by 10^j with j the smallest integer making max(|v\'|) < 1.', "v' = (v − min)/(max − min) · v' = (v − μ)/σ · v' = v/10^j"],
    ['Discretization and concept hierarchies', 'Decision-tree analysis is supervised and top-down; chi-merge is bottom-up, merging neighbouring intervals with low chi-square values; K-means clustering gives better discretization than equal-width or equal-frequency binning. Concept hierarchy example: street < city < state < country. The attribute with the most distinct values goes at the lowest level — except for cases like weekday, month, quarter, year.'],
  ]),
];

export const SUBJECTS = {
  midterm: {
    key: 'midterm', name: 'Stats', short: 'STATS', emoji: '📊',
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
  dm: {
    key: 'dm', name: 'Data Mining', short: 'DM', emoji: '⛏️',
    tagline: 'KDD · Similarity · Preprocessing · Reduction',
    hue: 'var(--c4)',
    questions: expand(dm), guides: dmGuides, explanations: null,
  },
};

export const GROUP_SIZE = 50;

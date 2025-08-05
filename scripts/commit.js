#!/usr/bin/env node

const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const { Command } = require('commander');

const git = simpleGit();

// Structured logger for consistent messaging
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
};

const types = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'sync',
  'release',
];

const MIN_CHAR_LENGTH = 2;
const MAX_CHAR_LENGTH = 100;

// Common validation functions
const validators = {
  type: (value) => {
    if (!types.includes(value)) {
      return `Invalid type: ${value}. Must be one of: ${types.join(', ')}`;
    }
    return true;
  },

  scope: (value) => {
    if (value.length < MIN_CHAR_LENGTH) {
      return `Scope must be at least ${MIN_CHAR_LENGTH} characters`;
    }
    return true;
  },

  title: (value) => {
    if (value.length < MIN_CHAR_LENGTH) {
      return `Title must be at least ${MIN_CHAR_LENGTH} characters`;
    }
    if (value.length > MAX_CHAR_LENGTH) {
      return `Title must not exceed ${MAX_CHAR_LENGTH} characters`;
    }
    return true;
  },

  ticket: (value) => {
    // Commander peut passer true pour les options optionnelles sans valeur
    if (value === true || value === undefined || value === '') {
      return true;
    }
    if (!/^([A-Z]+-\d+|\d+)$/.test(value)) {
      return `Invalid ticket format: ${value}. Must be like "MANAGER-1234" or "1234"`;
    }
    return true;
  },

  description: (value) => {
    // Commander peut passer true pour les options optionnelles sans valeur
    if (value === true || value === undefined || value === '') {
      return true;
    }
    if (value.length < MIN_CHAR_LENGTH) {
      return `Description must be at least ${MIN_CHAR_LENGTH} characters`;
    }
    if (value.length > MAX_CHAR_LENGTH) {
      return `Description must not exceed ${MAX_CHAR_LENGTH} characters`;
    }
    return true;
  },

  breaking: (value) => {
    // Commander peut passer true pour les options optionnelles sans valeur
    if (value === true || value === undefined || value === '') {
      return true;
    }
    if (!value.trim()) {
      return 'Breaking change description is required';
    }
    return true;
  },
};

// Adapter function to convert validators for Commander usage
const forCommander = (validator) => (value) => {
  const result = validator(value);
  if (result !== true) {
    throw new Error(result);
  }
  return value;
};

const program = new Command();

program
  .name('commit')
  .description('Interactive commit script with conventional commits support')
  .option(
    '-t, --type <type>',
    `commit type (${types.join(', ')})`,
    forCommander(validators.type),
  )
  .option(
    '-s, --scope <scope>',
    'scope of change',
    forCommander(validators.scope),
  )
  .option('-m, --title <title>', 'commit title', forCommander(validators.title))
  .option(
    '--ticket [ticket]',
    'ticket number (e.g., MANAGER-1234 or 1234)',
    forCommander(validators.ticket),
  )
  .option(
    '-d, --desc [description]',
    'long description',
    forCommander(validators.description),
  )
  .option(
    '-b, --breaking [description]',
    'breaking change description',
    forCommander(validators.breaking),
  )
  .parse();

const options = program.opts();

async function extractBranchInfo() {
  const branchName = await git.revparse(['--abbrev-ref', 'HEAD']);

  // Extract type from branch name (e.g., "fix/feature" -> "fix")
  const branchType = branchName.split('/')[0];

  // Extract ticket number if it exists (e.g., "TAPC-1234" -> "TAPC-1234")
  const ticketMatch = branchName.match(/(?:^|[-/])([A-Z]+-\d+|\d+)/);
  const ticket = ticketMatch ? ticketMatch[1] : null;

  return {
    branchType: types.includes(branchType) ? branchType : null,
    ticket,
  };
}

const getStagedCount = async () => {
  const status = await git.status();
  return status.staged.length;
};

// === PREPARATION FUNCTIONS ===
async function ensureReadyToCommit() {
  const stagedCount = await getStagedCount();
  if (stagedCount === 0) {
    logger.info('No files to commit');
    process.exit(0);
  }
}

async function prepareCommitContext() {
  const { branchType, ticket } = await extractBranchInfo();
  const hasAllCliParams = options.type && options.scope && options.title;

  return {
    branchType,
    ticket,
    useCliMode: hasAllCliParams,
  };
}

// === ANSWER COLLECTION FUNCTIONS ===
function collectCliAnswers(context) {
  return {
    type: options.type,
    scope: options.scope,
    title: options.title,
    ticket: options.ticket || context.ticket || '',
    description: options.desc || '',
    breaking: options.breaking || '',
  };
}

function buildQuestionsList(context) {
  const baseQuestions = [
    {
      type: 'list',
      name: 'type',
      message: 'Type of commit: (feat, fix, docs)',
      choices: types,
      default: context.branchType || types[0],
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Scope of change:',
      validate: validators.scope,
    },
    {
      type: 'input',
      name: 'title',
      message: 'Title of commit:',
      validate: validators.title,
    },
    {
      type: 'input',
      name: 'ticket',
      message: 'Ticket number:',
      default: context.ticket || '',
      validate: validators.ticket,
    },
  ];

  const optionalQuestions = [];

  if (options.desc !== undefined) {
    optionalQuestions.push({
      type: 'input',
      name: 'description',
      message: 'Description of commit:',
      validate: validators.description,
    });
  }

  if (options.breaking !== undefined) {
    optionalQuestions.push({
      type: 'input',
      name: 'breaking',
      message: 'Describe the breaking change:',
      validate: validators.breaking,
    });
  }

  return [...baseQuestions, ...optionalQuestions];
}

async function collectInteractiveAnswers(context) {
  const questions = buildQuestionsList(context);
  return inquirer.prompt(questions);
}

// === COMMIT MESSAGE BUILDER ===
function createCommitMessage(answers) {
  const parts = [];

  return {
    withHeader() {
      parts.push(`${answers.type}(${answers.scope}): ${answers.title}`);
      return this;
    },

    withDescription() {
      if (answers.description) {
        parts.push(answers.description);
      }
      return this;
    },

    withRefTicket() {
      if (answers.ticket) {
        parts.push(`ref: #${answers.ticket}`);
      }
      return this;
    },

    withBreakingChange() {
      if (typeof answers.breaking === 'string' && answers.breaking.trim()) {
        parts.push(`BREAKING CHANGE: ${answers.breaking}`);
      }
      return this;
    },

    withSignedOffBy(userName, userEmail) {
      parts.push(`Signed-off-by: ${userName.trim()} <${userEmail.trim()}>`);
      return this;
    },

    build() {
      return parts.join('\n\n');
    },
  };
}

// === COMMIT EXECUTION ===
async function executeCommit(answers) {
  const userName = await git.raw(['config', 'user.name']);
  const userEmail = await git.raw(['config', 'user.email']);

  const commitMessage = createCommitMessage(answers)
    .withHeader()
    .withDescription()
    .withRefTicket()
    .withBreakingChange()
    .withSignedOffBy(userName, userEmail)
    .build();

  await git.commit(commitMessage);
  logger.success('Commit created');
}

// === MODE HANDLERS ===
async function handleCliMode(context) {
  const answers = collectCliAnswers(context);
  await executeCommit(answers);
}

async function handleInteractiveMode(context) {
  const answers = await collectInteractiveAnswers(context);
  await executeCommit(answers);
}

// === MAIN FLOW ===
async function commit() {
  try {
    await ensureReadyToCommit();
    const context = await prepareCommitContext();

    if (context.useCliMode) {
      await handleCliMode(context);
    } else {
      await handleInteractiveMode(context);
    }
  } catch (error) {
    logger.error(`Error creating commit: ${error.message}`);
  }
}

commit();

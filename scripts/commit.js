#!/usr/bin/env node

const inquirer = require('inquirer');
const simpleGit = require('simple-git');

const git = simpleGit();

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

const args = process.argv.slice(2);
const isBreakingChange = args.includes('--breaking');
const isLongDescription = args.includes('--description');

async function extractBranchInfo() {
  const branchName = await git.revparse(['--abbrev-ref', 'HEAD']);

  // Extract type from branch name (e.g., "fix/feature" -> "fix")
  const branchType = branchName.split('/')[0];

  // Extract ticket number if it exists (e.g., "TAPC-1234" -> "TAPC-1234")
  const ticketMatch = branchName.match(/(^([A-Z]+-\d+|\d+)$)/);
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

const MIN_CHAR_LENGTH = 2;
const MAX_CHAR_LENGTH = 100;

async function commit() {
  try {
    const { branchType, ticket } = await extractBranchInfo();

    const stagedCount = await getStagedCount();
    if (stagedCount === 0) {
      console.log('No files to commit ❌');
      return;
    }

    const questions = [
      {
        type: 'list',
        name: 'type',
        message: 'Type of commit: (feat, fix, docs)',
        choices: types,
        default: branchType || types[0],
      },
      {
        type: 'text',
        name: 'scope',
        message: 'Scope of change:',
        validate: (input) => input.length > MIN_CHAR_LENGTH,
      },
      {
        type: 'input',
        name: 'title',
        message: 'Title of commit:',
        validate: (input) => input.length > MIN_CHAR_LENGTH,
      },
      {
        type: 'input',
        name: 'ticket',
        message: 'Ticket number:',
        default: ticket || '',
        validate: (input) =>
          input.length === 0 || /^([A-Z]+-\d+|\d+)$/.test(input),
        optional: true,
      },
    ];

    if (isLongDescription) {
      questions.push({
        type: 'input',
        name: 'description',
        message: 'Description of commit:',
        validate: (input) =>
          input.length > MIN_CHAR_LENGTH && input.length < MAX_CHAR_LENGTH,
      });
    }

    if (isBreakingChange) {
      questions.push({
        type: 'input',
        name: 'breaking',
        message: 'Describe the breaking change:',
        validate: (input) => {
          if (!input.trim()) {
            return 'Breaking change description is required';
          }
          return true;
        },
      });
    }

    const answers = await inquirer.prompt(questions);

    const refMessage = answers.ticket ? `ref: #${answers.ticket}\n\n` : '\n\n';
    let commitMessage = `${answers.type}(${answers.scope}): ${answers.title}\n\n`;

    if (isLongDescription) {
      commitMessage += `\n\n${answers.description}\n\n`;
    }

    commitMessage += refMessage;
    // Add breaking change footer if it exists
    if (answers.breaking) {
      commitMessage += `\n\nBREAKING CHANGE: ${answers.breaking}`;
    }

    const userName = await git.raw(['config', 'user.name']);
    const userEmail = await git.raw(['config', 'user.email']);

    // Add proper spacing and manually format the signed-off-by line
    commitMessage += '\n\n\n';
    commitMessage += `Signed-off-by: ${userName.trim()} <${userEmail.trim()}>`;

    await git.commit(commitMessage);
    console.log('Commit created ✅');
  } catch (error) {
    console.error('Error creating commit ❌', error);
  }
}

commit();

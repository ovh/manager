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
];

async function extractBranchInfo() {
  const branchName = await git.revparse(['--abbrev-ref', 'HEAD']);

  // Extract type from branch name (e.g., "fix/feature" -> "fix")
  const branchType = branchName.split('/')[0];

  // Extract ticket number if it exists (e.g., "TAPC-1234" -> "TAPC-1234")
  const ticketMatch = branchName.match(/([A-Z]+-\d+)/);
  const ticket = ticketMatch ? ticketMatch[1] : null;

  return {
    branchType: types.includes(branchType) ? branchType : null,
    ticket,
  };
}

const MIN_CHAR_LENGTH = 2;

async function commit() {
  try {
    const { branchType, ticket } = await extractBranchInfo();

    const answers = await inquirer.prompt([
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
        message: 'Scope of project: (instance, container, kms)',
        validate: (input) => input.length > MIN_CHAR_LENGTH,
      },
      {
        type: 'input',
        name: 'message',
        message: 'Description of commit: (ex: update label on region input)',
        validate: (input) => input.length > MIN_CHAR_LENGTH,
      },
      {
        type: 'input',
        name: 'ticket',
        message: 'Ticket number (ex: TAPC-1234):',
        default: ticket || '',
        validate: (input) => input.length === 0 || /^[A-Z]+-\d+$/.test(input),
        optional: true,
      },
    ]);

    const refMessage = answers.ticket ? `ref: #${answers.ticket}\n\n` : '';
    const commitMessage = `${answers.type}(${answers.scope}): ${answers.message}\n\n${refMessage}`;

    await git.commit(commitMessage, ['-s']);
    console.log('Commit created ✅');
  } catch (error) {
    console.error('Error creating commit ❌', error);
  }
}

commit();

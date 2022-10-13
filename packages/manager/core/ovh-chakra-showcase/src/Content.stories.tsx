import { StackDivider, VStack } from '@chakra-ui/react';

export default {
  title: 'Global style',
};

const TemplateAbbreviation = () => (
  <p>
    Praesent in congue purus, at{' '}
    <abbr title="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
      elementum sem
    </abbr>
    . Curabitur porta eros volutpat, sodales justo eu, congue metus.
  </p>
);
export const Abbreviation = TemplateAbbreviation.bind({});

const TemplateDescription = () => (
  <VStack
    divider={<StackDivider borderColor="gray.200" />}
    spacing={4}
    align="stretch"
  >
    <dl>
      <dt>Disk space</dt>
      <dd>250 GB (HDD)</dd>
      <dt>E-mail account</dt>
      <dd>100 + 5 GB</dd>
      <dt>Language</dt>
      <dd>PHP</dd>
      <dt>Shared DB</dt>
      <dd>MySQL Personal 3 x 400 MB</dd>
      <dd>MySQL Professional 3 x 400 MB</dd>
      <dt>Private SQL</dt>
      <dd>optional</dd>
    </dl>
    <dl className="horizontal">
      <dt>Disk space</dt>
      <dd>250 GB (HDD)</dd>
      <dt>E-mail account</dt>
      <dd>100 + 5 GB</dd>
      <dt>Language</dt>
      <dd>PHP</dd>
      <dt>Shared DB</dt>
      <dd>MySQL Personal 3 x 400 MB</dd>
      <dd>MySQL Professional 3 x 400 MB</dd>
      <dt>Private SQL</dt>
      <dd>optional</dd>
    </dl>
  </VStack>
);
export const Description = TemplateDescription.bind({});

const TemplateHeading = () => (
  <VStack spacing={4} align="stretch">
    <h1>h1. The quick brown fox jumps over the lazy dog</h1>
    <h2>h2. The quick brown fox jumps over the lazy dog</h2>
    <h3>h3. The quick brown fox jumps over the lazy dog</h3>
    <h4>h4. The quick brown fox jumps over the lazy dog</h4>
    <h5>h5. The quick brown fox jumps over the lazy dog</h5>
    <h6>h6. The quick brown fox jumps over the lazy dog</h6>
  </VStack>
);
export const Heading = TemplateHeading.bind({});

const TemplateLink = () => <a>The quick brown fox jumps over the lazy dog</a>;
export const Link = TemplateLink.bind({});

const TemplateList = () => (
  <VStack
    divider={<StackDivider borderColor="gray.200" />}
    spacing={4}
    align="stretch"
  >
    <ul>
      <li>
        <span>Item 1</span>
        <ul>
          <li>
            <a href="#">Item 1.1</a>
          </li>
          <li>
            <a href="#">Item 1.2</a>
          </li>
          <li>
            <a href="#">Item 1.3</a>
          </li>
        </ul>
      </li>
      <li>
        <span>Item 2</span>
        <ul>
          <li>
            <span>Item 2.1</span>
            <ul>
              <li>
                <span>Item 2.1.1</span>
                <ul>
                  <li>
                    <a href="#">Item 2.1.1.1</a>
                  </li>
                  <li>
                    <a href="#">Item 2.1.1.2</a>
                  </li>
                  <li>
                    <a href="#">Item 2.1.1.3</a>
                  </li>
                </ul>
              </li>
              <li>
                <span>Item 2.1.2</span>
              </li>
              <li>
                <span>Item 2.1.3</span>
              </li>
            </ul>
          </li>
          <li>
            <span>Item 2.2</span>
          </li>
          <li>
            <span>Item 2.3</span>
          </li>
        </ul>
      </li>
      <li>
        <a href="#">Item 3</a>
      </li>
      <li className="current">
        <a href="#">Item 4</a>
      </li>
      <li>
        <a href="#">Item 5</a>
      </li>
      <li>
        <a href="#">Item 6</a>
      </li>
    </ul>
    <ul className="separated">
      <li>
        <span>Item 1</span>
        <ul>
          <li>
            <a href="#">Item 1.1</a>
          </li>
          <li>
            <a href="#">Item 1.2</a>
          </li>
          <li>
            <a href="#">Item 1.3</a>
          </li>
        </ul>
      </li>
      <li>
        <span>Item 2</span>
        <ul>
          <li>
            <span>Item 2.1</span>
            <ul>
              <li>
                <span>Item 2.1.1</span>
                <ul>
                  <li>
                    <a href="#">Item 2.1.1.1</a>
                  </li>
                  <li>
                    <a href="#">Item 2.1.1.2</a>
                  </li>
                  <li>
                    <a href="#">Item 2.1.1.3</a>
                  </li>
                </ul>
              </li>
              <li>
                <span>Item 2.1.2</span>
              </li>
              <li>
                <span>Item 2.1.3</span>
              </li>
            </ul>
          </li>
          <li>
            <span>Item 2.2</span>
          </li>
          <li>
            <span>Item 2.3</span>
          </li>
        </ul>
      </li>
      <li>
        <a href="#">Item 3</a>
      </li>
      <li className="current">
        <a href="#">Item 4</a>
      </li>
      <li>
        <a href="#">Item 5</a>
      </li>
      <li>
        <a href="#">Item 6</a>
      </li>
    </ul>
  </VStack>
);
export const List = TemplateList.bind({});

const TemplateParagraph = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquet
    tellus enim, vel porttitor nulla pharetra vel. Praesent iaculis enim eu
    lacus dapibus bibendum. Cras in ex aliquam, eleifend arcu et hendrerit quam.
    Quisque fermentum bibendum lectus. Cras purus dolor, fermentum sit amet
    vulputate id, pretium quis lorem.
  </p>
);
export const Paragraph = TemplateParagraph.bind({});

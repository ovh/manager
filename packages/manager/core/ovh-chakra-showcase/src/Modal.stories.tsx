import {
  Box,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
} from '@chakra-ui/react';
import {
  CloseIcon,
  ErrorCircleIcon,
  HelpCircleIcon,
  InfoCircleIcon,
  SuccessCircleIcon,
  WarningCircleIcon,
} from '@ovh-ux/manager-themes';
import { useDisclosure } from "@chakra-ui/hooks"

export default {
  title: 'Example/Modal',
  component: Modal,
};

const TemplateSimple = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon}/>
          <ModalBody>
            <h4>Modal title</h4>
            <br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ligula nec fringilla tempor. In rhoncus ullamcorper feugiat. Phasellus vel ipsum vitae neque varius luctus. Proin id iaculis arcu. Fusce justo arcu, egestas vel nulla nec, dictum cursus lacus. Aenean elementum vel odio quis rutrum. In quis tellus in neque vulputate rhoncus vitae ut justo. Ut dignissim varius est in consequat. Donec nisi mauris, pellentesque condimentum congue in, blandit ut arcu. In et elit ipsum.
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export const Simple = TemplateSimple.bind({});

const Body = (IconElement: JSX.Element) => (
  <Grid
    templateAreas={`"icon content"`}
    templateRows={'auto 1fr'}
  >
    <GridItem area={'icon'} mt='.5rem'>
      {IconElement}
    </GridItem>
    <GridItem area={'content'}>
      <h4>Modal title</h4>
      <br/>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ligula nec fringilla tempor. In rhoncus ullamcorper feugiat. Phasellus vel ipsum vitae neque varius luctus. Proin id iaculis arcu. Fusce justo arcu, egestas vel nulla nec, dictum cursus lacus. Aenean elementum vel odio quis rutrum. In quis tellus in neque vulputate rhoncus vitae ut justo. Ut dignissim varius est in consequat. Donec nisi mauris, pellentesque condimentum congue in, blandit ut arcu. In et elit ipsum.
    </GridItem>
  </Grid>
);

const TemplateTypes = () => {
  const info = useDisclosure();
  const help = useDisclosure();
  const success = useDisclosure();
  const warning = useDisclosure();
  const error = useDisclosure();
  return (
    <>
      <HStack spacing={5}>
        <Button onClick={info.onOpen}>Open Info Modal</Button>
        <Button onClick={help.onOpen}>Open Help Modal</Button>
        <Button onClick={success.onOpen}>Open Success Modal</Button>
        <Button onClick={warning.onOpen}>Open Warning Modal</Button>
        <Button onClick={error.onOpen}>Open Error Modal</Button>
      </HStack>

      <Modal variant='info' isOpen={info.isOpen} onClose={info.onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon} />
          <ModalBody>
            {Body(
              <Box w={'5rem'} h={'5rem'} lineHeight={'5rem'} borderRadius={'5rem'} textAlign={'center'} mr={'2rem'} bg={'uikit.100'}>
                <InfoCircleIcon w={'3rem'} h={'3rem'} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal variant='help' isOpen={help.isOpen} onClose={help.onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon} />
          <ModalBody>
            {Body(
              <Box w={'5rem'} h={'5rem'} lineHeight={'5rem'} borderRadius={'5rem'} textAlign={'center'} mr={'2rem'} bg={'uikit.100'}>
                <HelpCircleIcon w={'3rem'} h={'3rem'} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal variant='success' isOpen={success.isOpen} onClose={success.onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon} />
          <ModalBody>
            {Body(
              <Box w={'5rem'} h={'5rem'} lineHeight={'5rem'} borderRadius={'5rem'} textAlign={'center'} mr={'2rem'} bg={'success.300'}>
                <SuccessCircleIcon w={'3rem'} h={'3rem'} color={'success.500'} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal variant='warning' isOpen={warning.isOpen} onClose={warning.onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon} />
          <ModalBody>
            {Body(
              <Box w={'5rem'} h={'5rem'} lineHeight={'5rem'} borderRadius={'5rem'} textAlign={'center'} mr={'2rem'} bg={'warning.300'}>
                <WarningCircleIcon w={'3rem'} h={'3rem'} color={'warning.500'} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal variant='error' isOpen={error.isOpen} onClose={error.onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon} />
          <ModalBody>
            {Body(
              <Box w={'5rem'} h={'5rem'} lineHeight={'5rem'} borderRadius={'5rem'} textAlign={'center'} mr={'2rem'} bg={'error.300'}>
                <ErrorCircleIcon w={'3rem'} h={'3rem'} color={'error.500'} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export const Types = TemplateTypes.bind({});

const TemplateWithActions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg='none' />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon}/>
          <ModalBody>
            <h4>Modal title</h4>
            <br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ligula nec fringilla tempor. In rhoncus ullamcorper feugiat. Phasellus vel ipsum vitae neque varius luctus. Proin id iaculis arcu. Fusce justo arcu, egestas vel nulla nec, dictum cursus lacus. Aenean elementum vel odio quis rutrum. In quis tellus in neque vulputate rhoncus vitae ut justo. Ut dignissim varius est in consequat. Donec nisi mauris, pellentesque condimentum congue in, blandit ut arcu. In et elit ipsum.
          </ModalBody>

          <ModalFooter>
            <Button variant='secondary' size='large' onClick={onClose}>
              Cancel
            </Button>
            <Button size='large' ml='1.5rem'>Ok</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export const WithActions = TemplateWithActions.bind({});

const TemplateWithBackdrop = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton as={CloseIcon}/>
          <ModalBody>
            <h4>Modal title</h4>
            <br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ligula nec fringilla tempor. In rhoncus ullamcorper feugiat. Phasellus vel ipsum vitae neque varius luctus. Proin id iaculis arcu. Fusce justo arcu, egestas vel nulla nec, dictum cursus lacus. Aenean elementum vel odio quis rutrum. In quis tellus in neque vulputate rhoncus vitae ut justo. Ut dignissim varius est in consequat. Donec nisi mauris, pellentesque condimentum congue in, blandit ut arcu. In et elit ipsum.
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export const WithBackdrop = TemplateWithBackdrop.bind({});

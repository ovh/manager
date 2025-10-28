import {
  Button,
  BUTTON_VARIANT,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  Icon,
  ICON_NAME,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import lzString from 'lz-string';
import React, { type JSX, type MutableRefObject, useState } from 'react';
import { type Editor } from '../types/editor';
import styles from './shareLink.module.css';

interface Prop {
  editorRef: MutableRefObject<Editor | undefined>;
  location: Location;
}

function encodeUrl(location: Location, code: string) {
  const searchParams = new URLSearchParams(location.search);

  searchParams.set('code', lzString.compressToEncodedURIComponent(code));

  return `${location.origin}${location.pathname}?${searchParams.toString()}`;
}

const ShareLink = ({ editorRef, location }: Prop): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  function onShareClick() {
    setShareLink(encodeUrl(location, editorRef.current?.getValue() || ''));
    setIsModalOpen(true);
  }

  return (
    <>
      <Button
        onClick={ onShareClick }
        variant={ BUTTON_VARIANT.ghost }>
        <Icon name={ ICON_NAME.shareNodes } /> Share
      </Button>

      <Modal
        onOpenChange={ ({ open }) => setIsModalOpen(open) }
        open={ isModalOpen }>
        <ModalContent color={ MODAL_COLOR.information }>
          <ModalBody>
            <p>
              You can use the following link to share your current sandbox sample:
            </p>

            <div className={ styles['share-link__modal__link'] }>
              <Clipboard value={ shareLink }>
                <ClipboardControl />
                <ClipboardTrigger />
              </Clipboard>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    aria-label="See limitations"
                    className={ styles['share-link__modal__link__warning'] }
                    name={ ICON_NAME.triangleExclamation }
                    role="img" />
                </TooltipTrigger>

                <TooltipContent>
                  The maximum length of a URL vary significantly depending on the browser being used.
                  <br />
                  While the HTTP specification does not define a maximum URL length, each browser impose their own limits.
                  <br />
                  Depending on the length of the code sample you try to share, it may not work properly on some browsers.
                </TooltipContent>
              </Tooltip>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export {
  ShareLink,
};

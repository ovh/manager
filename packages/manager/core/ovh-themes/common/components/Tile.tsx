import React from 'react';
import { Box, useMultiStyleConfig, chakra, Button, Skeleton } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

// eslint-disable-next-line prettier/prettier
import type { StyleFunctionProps } from '@chakra-ui/system';

const TileHeading = (props = {} as Partial<StyleFunctionProps>) => {
  const { variant, title, ...rest } = props;

  const styles = useMultiStyleConfig('Tile', { variant });

  return (
    <chakra.h5 __css={styles.heading} {...rest}>
      {title}
    </chakra.h5>
  );
};

const TileSectionButton = (
  props = {} as Partial<StyleFunctionProps>,
) => {
  const { variant, children, ...rest } = props;
  const styles = useMultiStyleConfig('Tile', { variant });

  return (
    <Button
      __css={styles.sectionButton}
      rightIcon={<ChevronRightIcon />}
      {...rest}
    >
      {children}
    </Button>
  );
};

const TileSectionDefinition = (props = {} as Partial<StyleFunctionProps>) => {
  const { variant, title, description, action, ...rest } = props;
  const styles = useMultiStyleConfig('Tile', { variant });
  const { sectionDefinition } = styles;
  const { title: titleStyles, description: descriptionStyles } = sectionDefinition as any;

  return (
    <chakra.span __css={styles.sectionDefinition} {...rest}>
      <chakra.dl flex={1}>
        <chakra.dt __css={titleStyles}>{title}</chakra.dt>
        <chakra.dd __css={descriptionStyles}>{description}</chakra.dd>
      </chakra.dl>
      {action}
    </chakra.span>
  )
}

export const TileSectionLoading = (props= {} as Partial<StyleFunctionProps>) => {
  const { variant, ...rest } = props;
  const styles = useMultiStyleConfig('Tile', { variant });
  const { title: titleStyles, description: descriptionStyles } = styles.sectionDefinition as any;

  return (
    <>
      {Array(4)
        .fill(null)
        .map((item: any, index: number) => (
          <chakra.div __css={styles.section} {...rest} key={index}>
            <chakra.span __css={styles.sectionDefinition} {...rest}>
              <chakra.dl flex={1}>
                <chakra.dt __css={titleStyles}>
                  <Skeleton mb='2' height={'1rem'}></Skeleton>
                </chakra.dt>
                <chakra.dd __css={descriptionStyles}>
                  <Skeleton height={'1rem'}></Skeleton>
                </chakra.dd>
              </chakra.dl>
            </chakra.span>
          </chakra.div>
        ))
      }
    </>
  );
};

export const TileSection = (props = {} as Partial<StyleFunctionProps>) => {
  const { variant, sectionType,...rest } = props;
  const styles = useMultiStyleConfig('Tile', { variant });

  return (
    <chakra.div __css={styles.section} {...rest}>
      {sectionType === 'button' ? (
        <TileSectionButton variant={variant} {...rest} />
      ) : (
        <TileSectionDefinition variant={variant} {...rest}></TileSectionDefinition>
      )}
    </chakra.div>
  );
};

export const TileSectionGroup = (props = {} as Partial<StyleFunctionProps>) => {
  const { variant, ...rest } = props;
  const styles = useMultiStyleConfig('Tile', { variant });

  return <chakra.div __css={styles.group} {...rest} className="tile-group" />;
};

export const Tile = (props = {} as Partial<StyleFunctionProps>) => {
  const { variant, title, children } = props;
  const { isLoading, ...restProps } = props;
  const styles = useMultiStyleConfig('Tile', { variant });

  return (
    <Box __css={styles.container} {...restProps}>
      {title && <TileHeading {...restProps} />}

      <chakra.div __css={styles.content}>
        {isLoading
          ? <TileSectionLoading {...restProps} />
          : children
        }
      </chakra.div>
    </Box>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  IconProps,
  Input,
  Spacer,
  useMultiStyleConfig,
  chakra,
  Popover,
  PopoverTrigger,
  PopoverContent,
  InputRightElement,
  InputGroup,
  PopoverArrow,
  useDisclosure,
} from '@chakra-ui/react';

import {
  ComponentWithAs,
  HTMLChakraProps,
  StyleFunctionProps,
  ThemingProps,
} from '@chakra-ui/system';
import { useCalendar } from '@h6s/calendar';
import {
  format,
  getDate,
  isEqual,
  Locale as DateLocale,
  isDate,
  isValid,
  compareAsc,
  addMonths,
  parse,
} from 'date-fns';

import { ChevronRightIcon, ChevronLeftIcon, CalendarIcon } from '../../index';

export interface CalendarProps
  extends HTMLChakraProps<'div'>,
    Partial<StyleFunctionProps>,
    ThemingProps<'Calendar'> {
  locale?: DateLocale;
  valueDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onDaySelect?: (date: Date) => void; // When a date is selected, either by day, month or year
  onDateClick?: (date: Date) => void; // When a day in the month is pressed
  nextIcon?: ComponentWithAs<'svg', IconProps>;
  prevIcon?: ComponentWithAs<'svg', IconProps>;
}

export interface InputCalendarProps extends Partial<StyleFunctionProps> {
  locale?: DateLocale;
  valueDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

export const capitalizeFirstLetter = (val: string) =>
  `${val.charAt(0).toUpperCase()}${val.slice(1)}`;

export const Calendar = (props: CalendarProps) => {
  const {
    variant,
    prevIcon,
    nextIcon,
    valueDate,
    locale,
    maxDate,
    minDate,
    disabledDates,
    onDaySelect,
    onDateClick,
    ...rest
  } = props;
  const [viewType, setViewType] = useState<'normal' | 'month' | 'year'>(
    'normal',
  );
  const styles = useMultiStyleConfig('Calendar', { variant });

  const { headers, body, navigation, cursorDate } = useCalendar();
  const [yearRange, setYearRange] = useState(
    [...Array(12).keys()].map((index) => cursorDate.getFullYear() + index),
  );
  // Compare dates without hours, minutes, seconds
  // Only compares year, month and day
  const isRoughlyEqual = (leftDate: Date, rightDate: Date) =>
    isEqual(
      new Date(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate()),
      new Date(
        rightDate.getFullYear(),
        rightDate.getMonth(),
        rightDate.getDate(),
      ),
    );

  const isDateDisabled = (date: Date) => {
    const disabledDateIndex = disabledDates?.findIndex((d: Date) =>
      isRoughlyEqual(d, date),
    ) as number;
    return (
      compareAsc(date, maxDate as Date) > -1 ||
      compareAsc(date, minDate as Date) < 1 ||
      disabledDateIndex > -1
    );
  };

  useEffect(() => {
    if (valueDate && isValid(valueDate) && isDate(valueDate))
      navigation.setDate(valueDate);
    else navigation.setDate(new Date());
  }, []);

  const selectDay = (day: Date) => {
    navigation.setDate(day);
    if (onDaySelect) onDaySelect(day);
  };

  const goNext = () => {
    if (viewType === 'year') {
      setYearRange(yearRange.map((year) => year + 12));
    } else {
      navigation.toNext();
      const currentDate = new Date();
      const expectedDate = addMonths(cursorDate, 1);
      if (
        expectedDate.getMonth() === currentDate.getMonth() &&
        currentDate.getFullYear() === expectedDate.getFullYear()
      )
        selectDay(new Date());
    }
  };

  const goPrev = () => {
    if (viewType === 'year') {
      setYearRange(yearRange.map((year) => year - 12));
    } else {
      navigation.toPrev();
      const currentDate = new Date();
      const expectedDate = addMonths(cursorDate, -1);
      if (
        expectedDate.getMonth() === currentDate.getMonth() &&
        currentDate.getFullYear() === expectedDate.getFullYear()
      )
        selectDay(new Date());
    }
  };

  const toggleMonthView = () => {
    if (viewType === 'month') setViewType('normal');
    else setViewType('month');
  };

  const toggleYearView = () => {
    if (viewType === 'year') setViewType('normal');
    else setViewType('year');
  };

  const normalView = (
    <Grid templateAreas={`"header" "main"`} __css={styles.main}>
      <GridItem area={'header'} height="fit-content">
        <HStack align="stretch">
          {headers.weekDays.map(({ key, value }) => (
            <Box as={chakra.span} key={key} __css={styles.week}>
              {format(value, 'iii', { locale })}
            </Box>
          ))}
        </HStack>
      </GridItem>
      <GridItem area={'main'}>
        <Grid templateRows="repeat(5, 1fr)" templateColumns="repeat(7, 1fr)">
          {body.value.map(({ value: days }) =>
            days.map(({ key: k, value, isCurrentMonth }) => {
              const disabled = isDateDisabled(value);

              return (
                <GridItem key={k}>
                  {isCurrentMonth && (
                    <chakra.button
                      type="button"
                      onClick={() => {
                        selectDay(value);
                        if (onDateClick) onDateClick(value);
                      }}
                      aria-pressed={
                        !disabled && isRoughlyEqual(cursorDate, value)
                      }
                      __css={styles.dateButton}
                      aria-disabled={disabled}
                      disabled={disabled}
                    >
                      {getDate(value)}
                    </chakra.button>
                  )}
                </GridItem>
              );
            }),
          )}
        </Grid>
      </GridItem>
    </Grid>
  );

  const monthView = (
    <Grid
      templateRows={{ md: 'repeat(3, 1fr)', xs: 'repeat(4, 1fr)' }}
      templateColumns={{ md: 'repeat(4, 1fr)', xs: 'repeat(3, 1fr)' }}
      gap={1}
    >
      {[...Array(12).keys()].map((monthNumber) => {
        const monthDate = new Date(
          cursorDate.getFullYear(),
          monthNumber,
          cursorDate.getDate(),
        );
        return (
          <GridItem key={monthNumber}>
            <chakra.button
              type="button"
              onClick={() => {
                selectDay(monthDate);
                toggleMonthView();
              }}
              aria-pressed={cursorDate.getMonth() === monthNumber}
              __css={styles.monthButton}
            >
              {capitalizeFirstLetter(format(monthDate, 'LLLL', { locale }))}
            </chakra.button>
          </GridItem>
        );
      })}
    </Grid>
  );

  const yearView = (
    <Grid
      templateRows={{ md: 'repeat(3, 1fr)', xs: 'repeat(4, 1fr)' }}
      templateColumns={{ md: 'repeat(4, 1fr)', xs: 'repeat(3, 1fr)' }}
      gap={1}
    >
      {yearRange.map((year) => {
        const yearDate = new Date(
          year,
          cursorDate.getMonth(),
          cursorDate.getDate(),
        );
        return (
          <GridItem key={year}>
            <chakra.button
              type="button"
              onClick={() => {
                selectDay(yearDate);
                toggleYearView();
              }}
              aria-pressed={cursorDate.getFullYear() === year}
              __css={styles.monthButton}
            >
              {format(yearDate, 'yyyy', { locale })}
            </chakra.button>
          </GridItem>
        );
      })}
    </Grid>
  );

  return (
    <Box __css={styles.root} {...rest}>
      <HStack __css={styles.header}>
        <chakra.button
          aria-label="previous month"
          onClick={() => goPrev()}
          __css={styles.headerButtons}
        >
          <Icon as={prevIcon || ChevronLeftIcon} __css={styles.headerIcons} />
        </chakra.button>
        <Spacer />
        <chakra.button
          onClick={() => toggleMonthView()}
          __css={styles.headerText}
        >
          {format(cursorDate, 'MMMM', { locale })}
        </chakra.button>
        <chakra.button
          onClick={() => toggleYearView()}
          __css={styles.headerText}
        >
          {format(cursorDate, 'yyyy', { locale })}
        </chakra.button>
        <Spacer />
        <chakra.button
          aria-label="next month"
          onClick={() => goNext()}
          __css={styles.headerButtons}
        >
          <Icon as={nextIcon || ChevronRightIcon} __css={styles.headerIcons} />
        </chakra.button>
      </HStack>
      <Divider __css={styles.divider} />
      {viewType === 'normal' && normalView}
      {viewType === 'month' && monthView}
      {viewType === 'year' && yearView}
    </Box>
  );
};

export const InputCalendar = (props: InputCalendarProps) => {
  const { locale, valueDate, maxDate, minDate, disabledDates } = props;
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState<Date>(
    valueDate || new Date(),
  );

  useEffect(() => {
    if (valueDate && isValid(valueDate) && isDate(valueDate))
      setSelectedDate(valueDate);
  }, []);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={true}
      closeOnEsc={true}
      returnFocusOnClose={false}
    >
      <InputGroup onClick={onToggle}>
        <Input
          type="text"
          value={format(selectedDate as Date, 'P', { locale })}
          isReadOnly
          cursor="pointer"
          _readOnly={{ background: 'transparent' }}
        ></Input>
        <InputRightElement>
          <PopoverTrigger>
            <IconButton
              variant="ghost"
              aria-label="Calendar icon"
              icon={<CalendarIcon />}
            />
          </PopoverTrigger>
        </InputRightElement>
      </InputGroup>

      <PopoverContent
        w="fit-content"
        paddingX="1rem"
        paddingTop=".5rem"
        paddingBottom="1rem"
        aria-label="Calendar popover"
      >
        <PopoverArrow />
        <Calendar
          valueDate={selectedDate}
          onDaySelect={(day) => {
            setSelectedDate(day);
          }}
          onDateClick={onClose}
          maxDate={maxDate}
          minDate={minDate}
          disabledDates={disabledDates}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
};

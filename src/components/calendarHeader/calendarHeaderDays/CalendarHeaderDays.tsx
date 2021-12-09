import { CalendarHeaderDaysProps } from './CalendarHeaderDays.props';
import { Context } from '../../../context/store';
import { useContext } from 'react';
import CalendarHeaderColText from '../components/calendarHeaderColText/CalendarHeaderColText';
import CalendarHeaderDates from '../components/calendarHeaderDates/CalendarHeaderDates';
import CalendarHeaderWeekDays from '../components/calendarHeaderWeekDays/CalendarHeaderWeekDays';
import CalendarHeaderWrapper from '../components/calendarHeaderWrapper/CalendarHeaderWrapper';

const CalendarHeaderDays = (props: CalendarHeaderDaysProps) => {
  const { isMonthView } = props;

  const [store] = useContext(Context);
  const { calendarDays, width } = store;

  const daysNum: number = isMonthView ? 7 : calendarDays.length;

  return (
    <CalendarHeaderWrapper isMonthView={isMonthView}>
      <CalendarHeaderColText>
        <CalendarHeaderWeekDays
          width={width}
          daysNum={daysNum}
          days={calendarDays}
        />
      </CalendarHeaderColText>
      {!isMonthView ? (
        <CalendarHeaderColText>
          <CalendarHeaderDates daysNum={daysNum} />
        </CalendarHeaderColText>
      ) : null}
    </CalendarHeaderWrapper>
  );
};

export default CalendarHeaderDays;

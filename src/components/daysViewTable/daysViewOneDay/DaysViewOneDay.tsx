import { CALENDAR_VIEW, EVENT_TYPE } from '../../../common/enums';
import { Context } from '../../../context/store';
import { DateTime } from 'luxon';
import {
  NormalEventPosition,
  OnEventClickFunc,
  OnEventDragFinishFunc,
  OnNewEventClickFunc,
} from '../../../common/interface';
import { calculateNormalEventPositions } from '../../../utils/eventLayout';
import { getDaysNum } from '../../../utils/calendarDays';
import { parseCssDark } from '../../../utils/common';
import { useContext, useEffect } from 'react';
import EventButton from '../../eventButton/EventButton';
import LuxonHelper from '../../../utils/luxonHelper';

const renderEvents = (
  dataset: Event[],
  baseWidth: number,
  defaultTimezone: string,
  selectedView: CALENDAR_VIEW,
  hourHeight: number,
  handleEventClick: OnEventClickFunc,
  day: DateTime,
  onEventDragFinish?: OnEventDragFinishFunc
) => {
  const calculatedResults: NormalEventPosition[] =
    calculateNormalEventPositions(
      dataset,
      baseWidth,
      defaultTimezone,
      hourHeight,
      selectedView
    );

  return calculatedResults.map((item: NormalEventPosition) => (
    <EventButton
      key={item.event.id}
      eventHeight={item.height}
      offsetTop={item.offsetTop}
      eventWidth={item.width}
      offsetLeft={item.offsetLeft}
      event={item.event}
      type={EVENT_TYPE.NORMAL}
      handleEventClick={handleEventClick}
      zIndex={item.zIndex}
      meta={item.meta}
      day={day}
      onEventDragFinish={onEventDragFinish}
    />
  ));
};

interface DaysViewOneDayProps {
  key: string;
  day: DateTime;
  index: number;
  handleNewEventClick: OnNewEventClickFunc;
  data: any;
  handleEventClick: OnEventClickFunc;
  onEventDragFinish?: OnEventDragFinishFunc;
}
const DaysViewOneDay = (props: DaysViewOneDayProps) => {
  const {
    day,
    index,
    data,
    handleNewEventClick,
    handleEventClick,
    onEventDragFinish,
  } = props;

  const [store] = useContext(Context);
  const { isDark, width, selectedView, hourHeight, timezone } = store;

  const oneDayStyle: any = {
    width: width / getDaysNum(selectedView),
    height: hourHeight * 24,
  };

  const isToday: boolean = LuxonHelper.isToday(day);
  const isFirstDay: boolean = index === 0;
  const dataForDay: any = data;

  const dateNow: any = DateTime.local();

  const nowPosition: number =
    dateNow
      .diff(DateTime.local().set({ hour: 0, minute: 0, second: 0 }), 'minutes')
      .toObject().minutes /
    (60 / hourHeight);

  useEffect(() => {
    if (isToday) {
      const elements: any = document.querySelectorAll(
        '.calendar-body__wrapper'
      );

      for (const element of elements) {
        element.scrollTo({ top: nowPosition - 40, behavior: 'smooth' });
      }
    }
  }, []);

  const eventNodes: any = renderEvents(
    dataForDay,
    width,
    timezone,
    selectedView,
    hourHeight,
    handleEventClick,
    day,
    onEventDragFinish
  );

  const handleEventClickInternal = (event: any) => {
    const rect: { top: number } = event.target.getBoundingClientRect();
    const y: number = event.clientY - rect.top;
    // Get hour from click event
    const hour: number = y / hourHeight;
    handleNewEventClick({ day: day.toJSDate(), hour, event });
  };

  return (
    <div
      id={`Calend__day__${day.toString()}`}
      key={day.toString()}
      style={oneDayStyle}
      className={
        !isFirstDay
          ? parseCssDark(
              'Calend__DayViewOneDay Calend__DayViewOneDay__border-left',
              isDark
            )
          : 'Calend__DayViewOneDay'
      }
      onClick={handleEventClickInternal}
    >
      {dataForDay && dataForDay.length > 0 ? eventNodes : null}
    </div>
  );
};

export default DaysViewOneDay;

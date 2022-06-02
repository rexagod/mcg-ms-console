import * as React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Popover, PopoverPosition } from '@patternfly/react-core';
import SecondaryStatus from '../../status/SecondaryStatus';
import { HealthState, healthStateMapping, healthStateMessage } from './states';

export type HealthItemProps = {
  className?: string;
  title: string;
  details?: string;
  state?: HealthState;
  popupTitle?: string;
  noIcon?: boolean;
  icon?: React.ReactNode;
  maxWidth?: string;
};

type HealthItemIconProps = {
  state?: HealthState;
  dataTest?: string;
};

const HealthItemIcon: React.FC<HealthItemIconProps> = ({ state, dataTest }) => (
  <div data-test={dataTest} className="co-dashboard-icon">
    {
      (healthStateMapping[state] || healthStateMapping[HealthState.UNKNOWN])
        .icon
    }
  </div>
);

// eslint-disable-next-line react/display-name
const HealthItem: React.FC<HealthItemProps> = React.memo(
  ({
    className,
    state,
    title,
    details,
    popupTitle,
    noIcon = false,
    icon,
    children,
    maxWidth,
  }) => {
    const { t } = useTranslation();

    const detailMessage = details || healthStateMessage(state, t);

    return (
      <div
        className={classNames('co-status-card__health-item', className)}
        data-item-id={`${title}-health-item`}
      >
        {state === HealthState.LOADING ? (
          <div className="skeleton-health">
            <span className="pf-u-screen-reader">
              {t('Loading {{title}} status', { title })}
            </span>
          </div>
        ) : (
          !noIcon &&
          (icon || (
            <HealthItemIcon state={state} dataTest={`health-item-icon`} />
          ))
        )}
        <div>
          <span className="co-status-card__health-item-text">
            {React.Children.toArray(children).length &&
            state !== HealthState.LOADING ? (
              <Popover
                position={PopoverPosition.top}
                headerContent={popupTitle}
                bodyContent={children}
                enableFlip
                maxWidth={maxWidth || '21rem'}
              >
                <Button
                  variant="link"
                  isInline
                  className="co-status-card__popup"
                  data-test="health-popover-link"
                >
                  {title}
                </Button>
              </Popover>
            ) : (
              title
            )}
          </span>
          {state !== HealthState.LOADING && detailMessage && (
            <SecondaryStatus
              status={detailMessage}
              className="co-status-card__health-item-text"
              dataStatusID={`${title}-secondary-status`}
            />
          )}
        </div>
      </div>
    );
  }
);

export default HealthItem;

import * as React from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@patternfly/react-core';
import {
  GripVerticalIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@patternfly/react-icons';

const withDragDropContext =
  <TProps extends {}>(
    Component: React.ComponentClass<TProps> | React.FC<TProps>
  ) =>
  // eslint-disable-next-line react/display-name
  (props: TProps) =>
    (
      <DndProvider backend={HTML5Backend}>
        <Component {...props} />
      </DndProvider>
    );

type NameValueEditorProps = {
  nameString: string;
  valueString: string;
  addString: string;
  allowSorting: boolean;
  readOnly: boolean;
  nameValueId: number;
  nameValuePairs: any;
  updateParentData: Function;
  configMaps: {};
  secrets: {};
  addConfigMapSecret: boolean;
  toolTip: string;
  onLastItemRemoved: () => void;
};

export const enum NameValueEditorPair {
  Name = 0,
  Value,
  Index,
}

type PairElementProps = {
  nameString: string;
  valueString: string;
  readOnly?: boolean;
  index?: number;
  pair?: any;
  allowSorting?: boolean;
  onChange: any;
  connectDragSource?: (arg: any) => any;
  connectDropTarget?: (args: any) => any;
  isDragging?: () => void;
  onMove: any;
  rowSourceId?: any;
  toolTip: {};
  alwaysAllowRemove?: {};
  onRemove?: any;
  isEmpty: boolean;
  disableReorder: boolean;
};

const PairElement: React.FC<PairElementProps> = ({
  index,
  onRemove: onRemoveProp,
  onChange,
  isDragging,
  connectDragSource,
  nameString,
  allowSorting,
  readOnly,
  pair,
  isEmpty,
  disableReorder,
  toolTip,
  valueString,
  alwaysAllowRemove,
}) => {
  const { t } = useTranslation('plugin__mcg-ms-console');
  const deleteIcon = (
    <>
      <MinusCircleIcon className="pairs-list__side-btn pairs-list__delete-icon" />
      <span className="sr-only">{t('Delete')}</span>
    </>
  );
  const dragButton = (
    <div>
      <Button
        type="button"
        className="pairs-list__action-icon"
        isDisabled={disableReorder}
        variant="plain"
        aria-label={t('Drag to reorder')}
      >
        <GripVerticalIcon className="pairs-list__action-icon--reorder" />
      </Button>
    </div>
  );

  const onChangeName = React.useCallback(
    (e) => {
      onChange(e, index, NameValueEditorPair.Name);
    },
    [index, onChange]
  );

  const onChangeValue = React.useCallback(
    (e) => {
      onChange(e, index, NameValueEditorPair.Value);
    },
    [index, onChange]
  );

  const onRemove = React.useCallback(() => {
    onRemoveProp(index);
  }, [index, onRemoveProp]);

  return (
    <div
      className={classNames(
        'row',
        isDragging ? 'pairs-list__row-dragging' : 'pairs-list__row'
      )}
      data-test="pairs-list-row"
    >
      {allowSorting && !readOnly && (
        <div className="col-xs-1 pairs-list__action">
          {disableReorder ? dragButton : connectDragSource(dragButton)}
        </div>
      )}
      <div className="col-xs-5 pairs-list__name-field">
        <input
          type="text"
          data-test="pairs-list-name"
          className="pf-c-form-control"
          placeholder={nameString}
          value={pair[NameValueEditorPair.Name]}
          onChange={onChangeName}
          disabled={readOnly}
        />
      </div>
      <div className="col-xs-5 pairs-list__value-field">
        <input
          type="text"
          data-test="pairs-list-value"
          className="pf-c-form-control"
          placeholder={valueString}
          value={pair[NameValueEditorPair.Value] || ''}
          onChange={onChangeValue}
          disabled={readOnly}
        />
      </div>
      {!readOnly && (
        <div className="col-xs-1 pairs-list__action">
          <Tooltip content={toolTip || t('Remove')}>
            <Button
              type="button"
              data-test="delete-button"
              className={classNames({
                'pairs-list__span-btns': allowSorting,
              })}
              onClick={onRemove}
              isDisabled={isEmpty && !alwaysAllowRemove}
              variant="plain"
            >
              {deleteIcon}
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export const NameValueEditor: React.FC<NameValueEditorProps> =
  withDragDropContext(
    ({
      nameValuePairs,
      updateParentData,
      nameValueId,
      onLastItemRemoved,
      addString,
      allowSorting,
      readOnly,
      toolTip,
      nameString,
      valueString,
    }) => {
      const { t } = useTranslation('plugin__mcg-ms-console');

      const append = React.useCallback(() => {
        updateParentData({
          nameValuePairs: nameValuePairs.concat([
            ['', '', nameValuePairs.length],
          ]),
        });
      }, [updateParentData, nameValuePairs]);

      const remove = React.useCallback(
        (i) => {
          const nameValuePairsUpdated = _.cloneDeep(nameValuePairs);
          nameValuePairsUpdated.splice(i, 1);
          nameValuePairsUpdated.forEach((values, index) => (values[2] = index)); // update the indices in order.

          updateParentData(
            {
              nameValuePairs: nameValuePairsUpdated.length
                ? nameValuePairsUpdated
                : [['', '', 0]],
            },
            nameValueId
          );

          if (nameValuePairsUpdated.length === 0 && !!onLastItemRemoved) {
            onLastItemRemoved();
          }
        },
        [nameValuePairs, onLastItemRemoved, updateParentData, nameValueId]
      );

      const change = React.useCallback(
        (e, i, type) => {
          const nameValuePairsCloned = _.cloneDeep(nameValuePairs);

          nameValuePairsCloned[i][
            type === NameValueEditorPair.Name
              ? NameValueEditorPair.Name
              : NameValueEditorPair.Value
          ] = e.target.value;
          updateParentData(
            { nameValuePairs: nameValuePairsCloned },
            nameValueId
          );
        },
        [nameValueId, nameValuePairs, updateParentData]
      );

      const move = React.useCallback(
        (dragIndex, hoverIndex) => {
          const nameValuePairsUpdated = _.cloneDeep(nameValuePairs);
          const movedPair = nameValuePairsUpdated[dragIndex];

          nameValuePairsUpdated[dragIndex] = nameValuePairsUpdated[hoverIndex];
          nameValuePairsUpdated[hoverIndex] = movedPair;
          updateParentData(
            { nameValuePairs: nameValuePairsUpdated },
            nameValueId
          );
        },
        [nameValuePairs, nameValueId, updateParentData]
      );

      const nameStringUpdated = nameString || t('Key');
      const valueStringUpdated = valueString || t('Value');
      const pairElems = nameValuePairs?.map((pair, i) => {
        const key = _.get(pair, [NameValueEditorPair.Index], i);
        const isEmpty =
          nameValuePairs.length === 1 &&
          nameValuePairs[0].every((value) => !value);
        return (
          <PairElement
            onChange={change}
            index={i}
            nameString={nameStringUpdated}
            valueString={valueStringUpdated}
            allowSorting={allowSorting}
            readOnly={readOnly}
            pair={pair}
            key={key}
            onRemove={remove}
            onMove={move}
            rowSourceId={nameValueId}
            isEmpty={isEmpty}
            disableReorder={nameValuePairs.length === 1}
            toolTip={toolTip}
          />
        );
      });
      return (
        <>
          <div className="row pairs-list__heading">
            {!readOnly && allowSorting && (
              <div className="col-xs-1 co-empty__header" />
            )}
            <div className="col-xs-5">{nameStringUpdated}</div>
            <div className="col-xs-5">{valueStringUpdated}</div>
            <div className="col-xs-1 co-empty__header" />
          </div>
          {pairElems}
          <div className="row">
            <div className="col-xs-12">
              {readOnly ? null : (
                <div className="co-toolbar__group co-toolbar__group--left">
                  <Button
                    className="pf-m-link--align-left"
                    data-test="add-button"
                    onClick={append}
                    type="button"
                    variant="link"
                  >
                    <PlusCircleIcon
                      data-test-id="pairs-list__add-icon"
                      className="co-icon-space-r"
                    />
                    {addString ? addString : t('Add more')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }
  );

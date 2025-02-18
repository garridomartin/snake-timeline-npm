'use client';

import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';

import { iconMapping, statusTextMapping } from './mappings/Mappings';
import Style from './SnakeTimeline.module.css';
import { DocumentStatusDTO } from '../../types/DTO/document.dto';
import { DocumentStatesEnum } from '../../types/enums/document-state-type.enum';

interface Props {
    data?: DocumentStatusDTO[];
}

const defaultData: DocumentStatusDTO[] = [
    {
        id: 1,
        createdBy: 'User 1',
        status: DocumentStatesEnum.NEW_DOCUMENT,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        createdBy: 'User 1',
        status: DocumentStatesEnum.EDITED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        createdBy: 'User 2',
        status: DocumentStatesEnum.IN_REVIEW,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 4,
        createdBy: 'User 1',
        status: DocumentStatesEnum.APPROVED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 5,
        createdBy: 'User 3',
        status: DocumentStatesEnum.REJECTED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 6,
        createdBy: 'User 1',
        status: DocumentStatesEnum.PUBLISHED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 7,
        createdBy: 'User 1',
        status: DocumentStatesEnum.ARCHIVED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 8,
        createdBy: 'User 1',
        status: DocumentStatesEnum.DELETED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 9,
        createdBy: 'User 4',
        status: DocumentStatesEnum.SENT,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 10,
        createdBy: 'User 2',
        status: DocumentStatesEnum.RECEIVED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 11,
        createdBy: 'User 1',
        status: DocumentStatesEnum.PENDING_APPROVAL,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 12,
        createdBy: 'User 3',
        status: DocumentStatesEnum.DRAFT,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 13,
        createdBy: 'User 1',
        status: DocumentStatesEnum.FINALIZED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 14,
        createdBy: 'User 2',
        status: DocumentStatesEnum.CANCELLED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 15,
        createdBy: 'User 4',
        status: DocumentStatesEnum.EXPIRED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 16,
        createdBy: 'User 1',
        status: DocumentStatesEnum.ON_HOLD,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 17,
        createdBy: 'User 3',
        status: DocumentStatesEnum.PROCESSING,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 18,
        createdBy: 'User 1',
        status: DocumentStatesEnum.COMPLETED,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

function SnakeTimeline({ data = defaultData }: Props) {
    const [elementsPerRow, setElementsPerRow] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateElementsPerRow = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const elementWidth = 200;

            setElementsPerRow(Math.floor(containerWidth / elementWidth));
        }
    };

    useEffect(() => {
        updateElementsPerRow();
        window.addEventListener('resize', updateElementsPerRow);

        return () => {
            window.removeEventListener('resize', updateElementsPerRow);
        };
    }, []);

    const groupedStatuses = data.reduce<DocumentStatusDTO[][]>(
        (acc, status, index) => {
            const rowIndex = Math.floor(index / elementsPerRow);

            if (!acc[rowIndex]) acc[rowIndex] = [];
            acc[rowIndex].push(status);

            return acc;
        },
        [],
    );

    return (
        <div className="flex justify-center items-center w-full h-full p-10">
            <div
                ref={containerRef}
                className={`flex flex-col min-w-full ${
                    groupedStatuses.length % 2 === 0
                        ? 'items-end'
                        : 'items-start'
                }`}
            >
                {groupedStatuses.map((row, rowIndex) => (
                    <TimelineRow
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        totalRows={groupedStatuses.length}
                    />
                ))}
            </div>
        </div>
    );
}

function TimelineRow({
    row,
    rowIndex,
    totalRows,
}: {
    row: DocumentStatusDTO[];
    rowIndex: number;
    totalRows: number;
}) {
    return (
        <div
            className={`relative flex ${rowIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
            {row.map((statusItem, index) => (
                <TimelineItem
                    key={statusItem.id}
                    statusItem={statusItem}
                    index={index}
                    rowIndex={rowIndex}
                    isLastRow={rowIndex === totalRows - 1}
                    isLastItem={index === row.length - 1}
                    totalRows={totalRows}
                />
            ))}
        </div>
    );
}

function TimelineItem({
    statusItem,
    index,
    rowIndex,
    isLastRow,
    isLastItem,
    totalRows,
}: {
    statusItem: DocumentStatusDTO;
    index: number;
    rowIndex: number;
    isLastRow: boolean;
    isLastItem: boolean;
    totalRows: number;
}) {
    const leftBorderClass = getLeftBorderClass(
        rowIndex,
        index,
        isLastRow,
        isLastItem,
        totalRows,
    );
    const rightBorderClass = getRightBorderClass(
        rowIndex,
        index,
        isLastRow,
        isLastItem,
        totalRows,
    );

    return (
        <div className="flex flex-col items-center w-[200px]">
            <div className="flex flex-row items-center w-52">
                <div
                    className={`flex-grow border-b-4 mb-1 relative ${leftBorderClass}`}
                />

                <div className="w-16 h-16 text-lg text-blue-500 relative rounded-full border-4 border-gray-700">
                    {iconMapping[statusItem.status] || (
                        <div className="text-center mt-2 font-bold text-3xl text-gray-700">
                            !
                        </div>
                    )}
                </div>

                <div
                    className={`flex-grow border-b-4 mb-1 ${rightBorderClass}`}
                />
            </div>

            <div className="flex flex-col items-center">
                <span className="font-bold">
                    {statusTextMapping[statusItem.status] || statusItem.status}
                </span>
                <span className="text-sm">
                    {format(new Date(statusItem.date), 'dd/MM/yyyy')}
                </span>
                <span className="text-sm mb-4">
                    {statusItem.createdBy || 'SYSTEM'}
                </span>
            </div>
        </div>
    );
}

function getLeftBorderClass(
    rowIndex: number,
    index: number,
    isLastRow: boolean,
    isLastItem: boolean,
    totalRows: number,
) {
    if (rowIndex === 0 && index === 0) return 'border-transparent';
    if (isLastRow && isLastItem && totalRows % 2 === 0)
        return 'border-transparent';
    if (
        (rowIndex % 2 === 0 && index === 0) ||
        (rowIndex % 2 === 1 && isLastItem)
    ) {
        return `border-gray-700 border-dashed ${rowIndex % 2 === 0 ? Style['arrow-right-l'] : Style['vertical-left']}`;
    }
    return 'border-gray-700';
}

function getRightBorderClass(
    rowIndex: number,
    index: number,
    isLastRow: boolean,
    isLastItem: boolean,
    totalRows: number,
) {
    if (
        (rowIndex % 2 === 1 && index === 0) ||
        (rowIndex === 0 && isLastItem && totalRows > 1)
    ) {
        return `border-gray-700 border-dashed ${rowIndex % 2 === 0 ? Style['vertical-right'] : Style['arrow-to-left-r']}`;
    }
    if (isLastRow && isLastItem && totalRows % 2 !== 0)
        return 'border-transparent';
    if (rowIndex % 2 === 0 && isLastItem) {
        return `border-gray-700 border-dashed ${rowIndex % 2 === 0 ? Style['vertical-right'] : Style['arrow-to-left-r']}`;
    }
    return 'border-gray-700';
}

export default SnakeTimeline;

import {Card, CardPanel} from "@/components/ui/card.tsx";
import {
    Pagination as COSSPagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {type Dispatch, type SetStateAction} from "react";
import {clsx} from "clsx";

interface Props {
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    pageCount: number;
}

export function Pagination(props: Props) {
    return (
        <Card className="sticky bottom-12 w-fit left-1/2 transform -translate-x-1/2 shadow-[0px_0px_25px_rgba(0,0,0,0.5)] bg-background/30 backdrop-blur-sm">
            <CardPanel className="p-1">
                <COSSPagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#"
                                                onClick={
                                                    () => props.setPage(currentPage => currentPage - 1)
                                                }
                                                className={clsx(props.page === 1 &&
                                                    'pointer-events-none cursor-default text-muted')}/>
                        </PaginationItem>

                        { // Show first page behind ellipsis if we are on page 3 or beyond
                            props.page >= 3 && <>
                                <PaginationItem>
                                    <PaginationLink href="#" onClick={() => props.setPage(1)}>
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis/>
                                </PaginationItem>
                            </>
                        }

                        { // On the last page show an additional button backwards
                            props.page === props.pageCount && props.pageCount > 3 &&
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => props.setPage(props.page - 2)}>
                                    {props.page - 2}
                                </PaginationLink>
                            </PaginationItem>
                        }

                        {
                            props.page > 1 &&
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => props.setPage(props.page - 1)}>
                                    {props.page - 1}
                                </PaginationLink>
                            </PaginationItem>
                        }

                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {props.page}
                            </PaginationLink>
                        </PaginationItem>

                        {
                            props.page < props.pageCount &&
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => props.setPage(props.page + 1)}>
                                    {props.page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        }

                        { // On the first page show one more button forward
                            props.page === 1 && props.pageCount >= 3 &&
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => props.setPage(props.page + 2)}>
                                    {props.page + 2}
                                </PaginationLink>
                            </PaginationItem>
                        }

                        { // Show ellipsis and last page button unless there is less than 3 pages, or we currently are on the last one
                            props.pageCount > 3 && props.page + 1 < props.pageCount &&
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis/>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink href="#" onClick={() => props.setPage(props.pageCount)}>
                                        {props.pageCount}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        }

                        <PaginationItem>
                            <PaginationNext href="#"
                                            onClick={
                                                () => props.setPage(currentPage => currentPage + 1)
                                            }
                                            className={clsx(props.page === props.pageCount &&
                                                'pointer-events-none cursor-default text-muted')}/>
                        </PaginationItem>
                    </PaginationContent>
                </COSSPagination>
            </CardPanel>
        </Card>
    );
}
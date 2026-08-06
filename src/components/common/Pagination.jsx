const Pagination = ({
    page,
    limit,
    total,
    onPageChange
}) => {

    const totalPages = Math.ceil(total / limit) || 1;

    if (totalPages <= 1) {
        return null;
    }

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    const pages = [];

    for (let current = startPage; current <= endPage; current += 1) {
        pages.push(current);
    }

    return (

        <nav aria-label="Pagination">

            <ul className="pagination mb-0">

                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>

                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >

                        Previous

                    </button>

                </li>

                {
                    pages.map(item => (

                        <li
                            key={item}
                            className={`page-item ${item === page ? "active" : ""}`}
                        >

                            <button
                                type="button"
                                className="page-link"
                                onClick={() => onPageChange(item)}
                            >

                                {item}

                            </button>

                        </li>

                    ))
                }

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>

                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >

                        Next

                    </button>

                </li>

            </ul>

        </nav>

    );

};

export default Pagination;

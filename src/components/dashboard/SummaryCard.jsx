const SummaryCard = ({

    title,

    value,

    bg

}) => {

    return (

        <div className="col-12 col-sm-6 col-xl-3 mb-3">

            <div className={`card text-white ${bg}`}>

                <div className="card-body">

                    <h6>

                        {title}

                    </h6>

                    <h3>

                        ₹ {value}

                    </h3>

                </div>

            </div>

        </div>

    );

};

export default SummaryCard;

import React from "react";

const HeaderContent = ({ Icon, title, description, details = [] }) => {
    return (
        <div className="flex items-center space-x-2 md:space-x-3 mb-6">
            {Icon && (
                <div className="p-3 bg-indigo-100 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600" />
                </div>
            )}

            <div>
                <h3 className="text-md md:text-lg font-medium text-gray-700">{title}</h3>

                {description && (
                    <p className="text-xs md:text-sm text-gray-500">
                        {description}
                    </p>
                )}

                {details.length > 0 && (
                    <div className="flex flex-row items-center gap-1 md:gap-2 md:mt-1">
                        {details.map((item, index) => {
                            const DetailIcon = item.icon;

                            return (
                                <React.Fragment key={item.label || index}>
                                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-500">
                                        {DetailIcon && (
                                            <DetailIcon className="hidden w-5 h-5 md:block" />
                                        )}
                                        <span className="text-xs md:text-sm">
                                            {item.label}
                                        </span>
                                    </div>

                                    {index < details.length - 1 && (
                                        <span className="block md:hidden">
                                            |
                                        </span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderContent;

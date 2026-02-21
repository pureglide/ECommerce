import React from 'react'

const STATUS_ORDER = [
  { key: "Order Placed", label: "Order Placed", labelShort: "Placed" },
  { key: "Packing", label: "Packing", labelShort: "Packing" },
  { key: "Shipped", label: "Shipped", labelShort: "Shipped" },
  { key: "Out for delivery", label: "Out for delivery", labelShort: "Delivery" },
  { key: "Delivered", label: "Delivered", labelShort: "Delivered" },
]

const StepIcon = ({ stepKey, isCompleted, isCurrent }) => {
  const baseClass = "w-4 h-4 sm:w-5 sm:h-5"
  if (isCompleted && !isCurrent) {
    return (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  const icons = {
    "Order Placed": (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    "Packing": (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    "Shipped": (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    "Out for delivery": (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    "Delivered": (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  }
  return icons[stepKey] || null
}

const OrderTrackTimeline = ({ currentStatus, className = "" }) => {
  const activeIndex = STATUS_ORDER.findIndex((s) => s.key === currentStatus)
  const progressIndex = activeIndex >= 0 ? activeIndex : -1

  return (
    <div className={`order-track-timeline min-w-0 ${className}`}>
      <div className="relative">
        {/* Track background */}
        <div
          className="absolute left-[22px] sm:left-[26px] top-4 sm:top-5 bottom-4 sm:bottom-5 w-[3px] bg-slate-200 rounded-full"
          aria-hidden
        />
        {/* Progress line */}
        <div
          className="absolute left-[22px] sm:left-[26px] top-4 sm:top-5 w-[3px] bg-slate-800 rounded-full order-track-line origin-top"
          style={{
            height: progressIndex >= 0 ? `${((progressIndex + 1) / STATUS_ORDER.length) * 100}%` : 0,
            minHeight: progressIndex >= 0 ? "1rem" : 0,
          }}
        />

        <div className="space-y-0">
          {STATUS_ORDER.map((step, idx) => {
            const isCompleted = idx <= progressIndex
            const isCurrent = idx === progressIndex
            const isPending = idx > progressIndex

            return (
              <div
                key={step.key}
                className={`relative flex items-center gap-4 py-3 sm:py-4 pl-2 transition-colors rounded-lg ${
                  isCurrent ? "bg-slate-100/80 -mx-2 px-2" : ""
                }`}
              >
                {/* Node */}
                <div
                  className={`
                    relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isCompleted && !isCurrent ? "bg-slate-800 text-white" : ""}
                    ${isCurrent ? "bg-slate-800 text-white ring-2 ring-slate-800/20 ring-offset-2" : ""}
                    ${isPending ? "bg-slate-200 text-slate-400" : ""}
                  `}
                >
                  <StepIcon stepKey={step.key} isCompleted={isCompleted} isCurrent={isCurrent} />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate sm:whitespace-normal ${
                      isCompleted ? "text-slate-800" : isCurrent ? "text-slate-900 font-semibold" : "text-slate-400"
                    }`}
                  >
                    <span className="sm:hidden">{step.labelShort}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-slate-500 mt-0.5">Current</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrderTrackTimeline

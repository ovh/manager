import React, { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react'
import { ODS_MESSAGE_TYPE, ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components'
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming'
import {
  NotificationType,
  useNotifications,
} from '@ovh-ux/manager-react-components'

type Notification = {
  uid: number
  content: React.ReactNode
  type: NotificationType
  dismissable?: boolean
}

const getOdsMessageColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_MESSAGE_TYPE.success
    case NotificationType.Error:
      return ODS_MESSAGE_TYPE.error
    case NotificationType.Warning:
      return ODS_MESSAGE_TYPE.warning
    case NotificationType.Info:
    default:
      return ODS_MESSAGE_TYPE.info
  }
}

const getOdsTextColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_TEXT_COLOR_INTENT.success
    case NotificationType.Error:
      return ODS_TEXT_COLOR_INTENT.error
    case NotificationType.Warning:
      return ODS_TEXT_COLOR_INTENT.warning
    case NotificationType.Info:
    default:
      return ODS_TEXT_COLOR_INTENT.info
  }
}

const OdsNotification = ({
  notification,
}: {
  notification: Notification
}) => {
  const { clearNotification } = useNotifications()

  return (
    <OsdsMessage
      className="mb-2"
      type={getOdsMessageColor(notification.type)}
      {...(notification.dismissable
        ? {
            removable: true,
            onOdsRemoveClick: () => clearNotification(notification.uid),
          }
        : {})}
    >
      <OsdsText
        color={getOdsTextColor(notification.type)}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {notification.content}
      </OsdsText>
    </OsdsMessage>
  )
}

/**
 * TanStack Router compatible replacement for `@ovh-ux/manager-react-components`'s
 * Notifications component (which is coupled to react-router-dom's `useLocation`).
 */
export const Notifications = ({ clearAfterRead = true }: { clearAfterRead?: boolean }) => {
  const location = useLocation()
  const [originLocation] = useState(location)
  const { notifications, clearNotifications } = useNotifications()

  useEffect(() => {
    if (clearAfterRead && originLocation.pathname !== location.pathname) {
      clearNotifications()
    }
  }, [clearAfterRead, location.pathname])

  return (
    <>
      {notifications.map((notification) => (
        <OdsNotification key={notification.uid} notification={notification} />
      ))}
    </>
  )
}

export default Notifications

